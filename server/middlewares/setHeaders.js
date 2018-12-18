// routes configuration
const { getRouteConfig, setRouteHeaders } = require('../routes/routes.config');

function setHeaders(req, res, next) {

	const routeConfig = getRouteConfig(req.path);
	// console.log('setHeaders - routeConfig: ', routeConfig);
	if (routeConfig) {
		console.log('req.routeConfig1: ', req.routeConfig);
		req.routeConfig = routeConfig;
	}
	console.log('req.routeConfig: ', req.routeConfig);
	setRouteHeaders(req, res, next);
}

module.exports = {
	setHeaders
}