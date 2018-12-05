// routes configuration
const { setRouteHeaders } = require('../routes/routes.config');

function setHeaders(req, res, next) {
	setRouteHeaders(req, res, next);
}

module.exports = {
	setHeaders
}