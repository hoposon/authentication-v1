const routesConfig = {
	'/v1/users/register': {
		enabled: true,
		cors: {
			origin: '*',
			methods: 'POST',
			allowedHeaders: 'Content-Type,Authorization',
			credentials: false,
			optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
		}
	},
	'/v1/users/login': {
		enabled: true,
		cors: {
			origin: 'http://example.com',
			optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
		}
	},
	'/test/test': {
		enabled: true,
		cors: {
			origin: '*',
			optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
		}
	}
}

const corsDefault = {
	// origin: 'http://localhost'
	origin: 'http://example.com'
}

const getCorsConfig = (req, callback) => {
	callback(null, routesConfig[req.originalUrl].cors || corsDefault) ;
}

module.exports = {
	routesConfig,
	getCorsConfig
}