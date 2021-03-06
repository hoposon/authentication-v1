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
			authenticate: false,
			authorization: {
				authorize: false,
				operationType: 'create',
				resources: 'users'
			}			
		}
	},
	'/v1/users/login': {
		'POST' : {
			enabled: true,
			cors: {
				origin: 'http://example.com',
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: false,
			authorization: {
				authorize: false,
				operationType: 'read',
				resources: 'users'
			}
		}
	},
	'/v1/users/roles': {
		'PATCH' : {
			enabled: true,
			cors: {
				origin: 'http://example.com',
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: true,
			authorization: {
				authorize: false,
				operationType: 'create',
				resources: 'roles'
			}
		}
	},
	'/test/test': {
		'GET' : {
			enabled: true,
			cors: {
				origin: '*',
				//optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: false,
			authorization: {
				authorize: false,
				operationType: '',
				resources: ''
			}
		}
	},
	'/test/test/fooauthenticated': {
		'GET' : {
			enabled: true,
			cors: {
				origin: '*',
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: true,
			authorization: {
				authorize: false,
				operationType: '',
				resources: ''
			}
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
			authenticate: true,
			authorization: {
				authorize: true,
				operationType: 'read',
				resources: 'projects'
			}
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
			authenticate: true,
			authorization: {
				authorize: true,
				operationType: 'create',
				resources: 'projects'
			}
		}
	},
	'/v1/tickets': {
		'GET' : {
			enabled: true,
			cors: {
				origin: '*',
				methods: 'GET',
				allowedHeaders: 'Content-Type,Authorization',
				credentials: false,
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: true,
			authorization: {
				authorize: true,
				operationType: 'read',
				resources: 'tickets'
			}
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
			authenticate: true,
			authorization: {
				authorize: true,
				operationType: 'create',
				resources: 'tickets'
			}
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