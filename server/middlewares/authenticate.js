// response codes and massages
const { setResponse } = require('../responses.config');

const {User} = require('../models/userModel');

const authenticate = (req, res, next) => {

	if (req.routesConfig[req.method] && req.routesConfig[req.method].authenticate) {

		const token = req.header('Authorization');
		console.log('auth header: ', token);
		User.findByToken(token).then((user) => {
			if(!user) {
				return Promise.reject();
				// same as
				// res.status(401).send();
				// this jumps to catch block
			}
			// console.log('user: ', user);
			// console.log('user._id: ', user._id);
			req.user = user;
			req.token = token;
			next();
		}).catch((e) => {
			// !TODO - log error to server
			setResponse(req, res, '401');
		});
	} else if (req.routesConfig[req.method] && req.routesConfig[req.method].authenticate === false) {
		next();
	} else {
		// !TODO - log error to server
		setResponse(req, res, '500');
	}
    
};

module.exports = {authenticate};