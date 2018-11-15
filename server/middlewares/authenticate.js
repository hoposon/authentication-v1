// routes configuration
const { routesConfig } = require('../routes/routes.config');
// response codes and massages
const { setResponse } = require('../responses.config');

const {User} = require('../models/userModel');

const authenticate = (req, res, next) => {

	if (routesConfig[req.path]) {

		if (routesConfig[req.path].authenticate) {
			const token = req.header('x-auth');
    
			User.findByToken(token).then((user) => {
				if(!user) {
					return Promise.reject();
					// same as
					// res.status(401).send();
					// this jumps to catch block
				}

				req.user = user;
				req.token = token;
				
			}).catch((e) => {
				// !TODO - log error to server
				setResponse(req, res, '401');
			});
		}
		
		next();

	} else {
		// !TODO - log error to server
		setResponse(req, res, '500');
	}
    
};

module.exports = {authenticate};