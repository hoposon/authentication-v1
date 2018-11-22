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
router.options('/acl');
router.post('/acl', manageAcl);

function register(req, res, next) {
	const body = _.pick(req.body, ['email', 'password', 'firstName', 'lastName']);
	const user = new User(body);

	user.generateAuthToken().then((token) => {
		if(!token) {
			return Promise.reject();
		}
		setResponse(req, res, '200', user);
	}).catch((e) => {
		// !TODO - log error to server and handle error by message
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

function manageAcl(req, res, next) {
	
	let tempUser = req.user;
	tempUser.acls = _.pick(req.body, ['acl']).acl;
	
	const user = new User(tempUser);
	user.save().then((user) => {
		if(!user) {
			return Promise.reject();
		}
		setResponse(req, res, '200', user);
	}).catch((e) => {
		setResponse(req, res, '500');
	})
}


module.exports = router;