const routesPatterns = {
	':ticketId': '([a-z0-9])+',
	':commentId': '([a-z0-9])+',
	':unitId': '([a-z0-9])+'
}

const routesConfig = {
	'/v1/timeunits': {
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
	'/v1/timeunits/:unitId': {
		'DELETE' : {
			enabled: true,
			cors: {
				origin: '*',
				methods: 'DELETE',
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
	},
	'/v1/tickets/:ticketId': {
		'PUT' : {
			enabled: true,
			cors: {
				origin: '*',
				methods: 'PUT',
				allowedHeaders: 'Content-Type,Authorization',
				credentials: false,
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: true,
			authorization: {
				authorize: true,
				operationType: 'update',
				resources: 'tickets'
			}
		}
	},
	'/v1/tickets/:ticketId/comments': {
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
				resources: 'comments'
			}
		}
	},
	'/v1/tickets/:ticketId/workloads': {
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
				resources: 'workloads'
			}
		}
	},
	'/v1/tickets/:ticketId/comments/:commentId': {
		'PUT' : {
			enabled: true,
			cors: {
				origin: '*',
				methods: 'PUT',
				allowedHeaders: 'Content-Type,Authorization',
				credentials: false,
				optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
			},
			authenticate: true,
			authorization: {
				authorize: true,
				operationType: 'update',
				resources: 'tickets'
			}
		}
	}
}

const corsDefault = {
	origin: 'http://localhost'
	// origin: 'http://example.com'
}

const headersDefault = {
	'Content-Type' : 'application/json',
	'X-Content-Type-Options': 'nosniff'
}

const getCorsConfig = (req, callback) => {
	// console.log('req.routeConfig2: ', req.routeConfig);
	callback(null, req.routeConfig[req.method].cors || corsDefault) ;
}

const setHeaders = (headers, res) => {
	for (const header in headers) {
		res.header(header, headers[header]);
	}
}

const setDeaultHeaders = (req, res) => {
	setHeaders(headersDefault, res);
}

const setRouteHeaders = (req, res) => {
	let headers = headersDefault;
	// console.log('req.routeConfig2: ', req.routeConfig);
	if (req.routeConfig[req.method] && req.routeConfig[req.method].headers) {
		headers = {...headers, ...req.routeConfig[req.method].headers};
	}
	setHeaders(headers, res);
}

const getRouteConfig = (url) => {
	// console.log('routesConfig: ', routesConfig);
	for (let path in routesConfig) {
		// console.log('path1: ', path);
		let pathMatch = '^'+path;
		// console.log('path2: ', pathMatch);
		for (const pattern in routesPatterns) {
			pathMatch = pathMatch.replace(pattern, routesPatterns[pattern]);
			// console.log('path2: ', pathMatch);
		}
		// console.log('path3: ', path.replace(/\//g, '\\/'));
		pathMatch = pathMatch.replace(/\//g, '\\/');
		pathMatch += '$';
		// console.log('path4: ', pathMatch);
		
		// const regStr = new RegExp(path,'g');
		// const regStr = /^\/v1\/tickets\/[0-9]+/g;
		// console.log('url to match: ', url);
		// console.log('regexp: ', pathMatch);
		// console.log('match: ', new RegExp(pathMatch).test(url));
		if (new RegExp(pathMatch).test(url)) {
			console.log('pattern matched: ', pathMatch);		
			return routesConfig[path];
		}
	}
	console.log('pattern notmatched: ');
	return false
}

module.exports = {
	getRouteConfig,
	getCorsConfig,
	setRouteHeaders,
	setDeaultHeaders
}