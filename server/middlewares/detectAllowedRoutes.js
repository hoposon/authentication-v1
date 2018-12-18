// response codes and massages
const { setResponse } = require('../responses.config');

const detectAllowedRoutes = (req, res, next) => {

	if (req.routeConfig) {
		if (req.routeConfig[req.method] && req.routeConfig[req.method].enabled) {
			// console.log('detectAllowedRoutes - OK: ', req.routeConfig);
			// setResponse(req, res, '200');
			next();
		} else {
			// !TODO - log error to server
			// console.log('detectAllowedRoutes - NOK: ');
			setResponse(req, res, '404');
		}
	}
}

module.exports = {detectAllowedRoutes};