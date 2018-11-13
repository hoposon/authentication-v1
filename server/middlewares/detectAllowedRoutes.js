// routes configuration
const { routesConfig } = require('../routes/routes.config');
// response codes and massages
const getCodeAndMessage = require('../responses.config');

const detectAllowedRoutes = (req, res, next) => {
	if (routesConfig[req.path] && routesConfig[req.path].enabled) {
		next();
	} else {
		// !TODO - log error to server
		const { code, message } = getCodeAndMessage('notFound');
		res.status(code).send({code, message});
	}
}

module.exports = {detectAllowedRoutes};