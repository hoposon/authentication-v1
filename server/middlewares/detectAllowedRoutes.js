// routes configuration
const { getRouteConfig, setDeaultHeaders } = require('../routes/routes.config');
// response codes and massages
const { setResponse } = require('../responses.config');

const detectAllowedRoutes = (req, res, next) => {

	const routeConfig = getRouteConfig(req.path);
	if (routeConfig) {
		// console.log('req.routeConfig1: ', req.routeConfig);
		req.routeConfig = routeConfig;
		if (req.routeConfig[req.method] && req.routeConfig[req.method].enabled) {
			// console.log('detectAllowedRoutes - OK: ', req.routeConfig);
			// setResponse(req, res, '200');
			return next();
		}
		// else {
		// 	// !TODO - log error to server
		// 	// console.log('detectAllowedRoutes - NOK: ');
		// 	setResponse(req, res, '404');
		// }
	}
	// !TODO recognize if the path is bad (500) or if just the pattern is not matched (422)
	setDeaultHeaders(req, res);
	setResponse(req, res, '404');
}

module.exports = {detectAllowedRoutes};