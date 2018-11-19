// routes configuration
const { routesConfig } = require('../routes/routes.config');
// response codes and massages
const { setResponse } = require('../responses.config');

const detectAllowedRoutes = (req, res, next) => {
	if (routesConfig[req.path] && routesConfig[req.path][req.method] && routesConfig[req.path][req.method].enabled) {
		next();
	} else {
		// !TODO - log error to server
		setResponse(req, res, '404');
	}
}

module.exports = {detectAllowedRoutes};