const express = require('express');
const _ = require('lodash');
const {User} = require('../models/userModel');
// response codes and massages
const { setResponse } = require('../responses.config');

const router = express.Router();

// routes
router.options('/register');
router.post('/register', register);
router.options('/login');
router.post('/login', login);
router.options('/roles');
router.patch('/roles', grantRoles);

function register(req, res, next) {
	const body = _.pick(req.body, ['email', 'password', 'firstName', 'lastName']);
	const user = new User(body);
	// console.log('user1: ', user);
	user.generateAuthToken().then((token) => {
		// console.log('user2: ', user);
		if(!token) {
			return Promise.reject();
		}
		// console.log('user3: ', user);
		setResponse(req, res, '201', user);
	}).catch((e) => {
		// !TODO - log error to server and handle error by message
		// console.log('reg 500 error: ', e);
		setResponse(req, res, '500');
	});
}

function login(req, res, next) {
	const body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('Authorization', token);
			setResponse(req, res, '200', user);
		});
    }).catch((e) => {
		// !TODO - log error to server
		setResponse(req, res, '401');
    });
}

function grantRoles(req, res, next) {
	
	const tempUser = _.pick(req.body, ['userId', 'email', 'roles']);
	
	User.findOne({
		_id: tempUser.userId,
		email: tempUser.email
	}).then((user) => {
		console.log('grantRoles user: ', user);
		return user.updateRoles(true, tempUser.roles);
	}).then(() => {
		setResponse(req, res, '200');
	}).catch((e) => {
		console.log(e);
		setResponse(req, res, '422', {
			fields: {
				userId: "Not found",
				email: "Not found"
			}
		});
	});
}


module.exports = router;