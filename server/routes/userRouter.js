const express = require('express');
const _ = require('lodash');
// const userServices = require('../services/userServices');
const {User} = require('../models/userModel');
const getCodeAndMessage = require('../responses.config');
const {authenticate} = require('../middlewares/authenticate');

const router = express.Router();

// routes
router.options('/register');
router.post('/register', register);
router.options('/login');
router.post('/login', login);

function register(req, res, next) {
	const body = _.pick(req.body, ['email', 'password']);
	const user = new User(body);

	const token = user.generateAuthToken();
	if (token) {
		user.save().then(() => {
			res.send(user);
		}).catch((e) => {
			// !TODO - log error to server and handle error by message
			console.log('double registration exception: ', e);
			const { code, message } = getCodeAndMessage('internalServerError');
			res.status(code).send({code, message});
		});
	} else {
		// !TODO - log error to server
		const { code, message } = getCodeAndMessage('internalServerError');
		res.status(code).send({code, message});
	}
}

function login(req, res, next) {
	const body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        const token = user.generateAuthToken();
        res.header('x-auth', token).send(user);       
    }).catch((e) => {
		// !TODO - log error to server
		const { code, message } = getCodeAndMessage('400');
        res.status(code).send({ code, message });
    });
}


module.exports = router;