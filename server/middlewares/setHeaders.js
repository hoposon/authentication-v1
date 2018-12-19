const { setRouteHeaders } = require('../routes/routes.config');
// response codes and massages
const { setResponse } = require('../responses.config');

function setHeaders(req, res, next) {
	setRouteHeaders(req, res);
	next();
}

module.exports = {
	setHeaders
}