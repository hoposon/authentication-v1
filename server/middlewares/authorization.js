// routes configuration
const { routesConfig } = require('../routes/routes.config');

let roles = {
	aclAdmin: {
		can: {
			edit: {
				rosources: /^acl$/,
			}
		}
	},
	admin: {
		can: {
			edit: {
				rosources: /^((?!acl).)*$/
			},
			read: {
				rosources: /.+/	
			}
		},
		inherits: ['user']
	},
	owner: {
		can: {
			edit: {
				rosources: /^ticket$/,
				condition: {
					mongoCond: (params) => {
						return params.user.id === params.post.owner
					}
				}				
			}
		},
		inherits: ['user']
	},
    user: {
		can: {
			read: {
				resources: /.+/
			}
		}
    }
}

class RBAC {

	constructor(opts) {
        this.init(opts);
	}
	
	init(roles) {
		this.roles = opts;
	}

	can(userRole, operation, resources) {

		let retCan = {can: false};
		
		// Check if role exists
		if(!this.roles[userRole]) {
			return {
				can: false
			};
		}

		let _role = this.roles[role];
		// Check if this role has this operation
		if (_role.can[operation] &&
			_role.can[operation].resources.test(resources) &&
			_role.can[operation].condition
			) {
			retCan = {
				can: true,
				condition: _role.can[operation].condition
			}
		} else if (_role.can[operation] &&
				   _role.can[operation].resources.test(resources)) {
			return {
				can: true,
				condition: false
			}
		}

		// Check if there are any parents
		if(!_role.inherits || _role.inherits.length < 1) {
			return retCan;
		}

		// Check child roles until one returns true or all return false
		_role.inherits.array.forEach(childRole => {
			let tempCan = this.can(childRole, operation, resources);
			if (tempCan.can && !retCan.can) {
				return tempCan;
			} else if (+!!tempCan.condition > +!!retCan.condition) {
				return tempCan;
			}
		});

		return retCan;

	}
}

const authorize = (req, res, next) => {

	if (routesConfig[req.path] && 
		routesConfig[req.path][req.method] && 
		routesConfig[req.path][req.method].authorization &&
		routesConfig[req.path][req.method].authorization.authorize) {

		const operation = routesConfig[req.path][req.method].authorize.operationType || ['edit'];
		const auth = new RBAC(roles);
		if(auth.can(req.user.acls, operation))

	} else if (routesConfig[req.path] && 
		routesConfig[req.path][req.method] && 
		routesConfig[req.path][req.method].authorization &&
		routesConfig[req.path][req.method].authorization.authorize === false) {
		next();
	} else {
		// !TODO - log error to server
		setResponse(req, res, '500');
	}

}

module.exports = {
	authorize
};