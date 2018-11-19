const routesConfig = {
	'/v1/users/register': {
		'POST' : {
			enabled: true,
			cors: {
				origin: '*',
				methods: 'POST',
				allowedHeaders: 'Content-Type,Authorization',
				credentials: false,
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: false
		}
	},
	'/v1/users/login': {
		'POST' : {
			enabled: true,
			cors: {
				origin: 'http://example.com',
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: false
		}
	},
	'/test/test': {
		'GET' : {
			enabled: true,
			cors: {
				origin: '*',
				//optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: false
		}
	},
	'/test/test/fooauthenticated': {
		'GET' : {
			enabled: true,
			cors: {
				origin: '*',
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: true
		}
	},
	'/v1/projects': {
		'GET' : {
			enabled: true,
			cors: {
				origin: '*',
				methods: 'GET',
				allowedHeaders: 'Content-Type,Authorization',
				credentials: false,
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: true
		},
		'POST' : {
			enabled: true,
			cors: {
				origin: '*',
				methods: 'POST',
				allowedHeaders: 'Content-Type,Authorization',
				credentials: false,
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: true
		}
	}
}

const corsDefault = {
	// origin: 'http://localhost'
	origin: 'http://example.com'
}

const headersDefault = {
	'Content-Type' : 'application/json',
	'X-Content-Type-Options': 'nosniff'
}

const getCorsConfig = (req, callback) => {
	callback(null, routesConfig[req.originalUrl].cors || corsDefault) ;
}

const setRouteHeaders = (req, res, next) => {
	let headers = headersDefault;
	if (routesConfig && routesConfig[req.originalUrl] && routesConfig[req.originalUrl].headers) {
		headers = {...headers, ...routesConfig[req.path].headers};
	}
	for (const header in headers) {
		res.header(header, headers[header]);
	}
	next();
}

module.exports = {
	routesConfig,
	getCorsConfig,
	setRouteHeaders
}