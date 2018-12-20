let roles = {
	grantsAdmin: {
		can: {
			create: {
				rosources: /^roles$/,
			},
			delete: {
				rosources: /^roles$/,
			}
		}
	},
	admin: {
		can: {
			create: {
				resources: /^((?!roles).)*$/
			},
			read: {
				rosources: /.+/	
			},
			update: {
				rosources: /.+/
			},
			delete: {
				rosources: /^((?!roles).)*$/
			},
			
		},
		inherits: ['user']
	},
	owner: {
		can: {
			create: {
				rosources: /^ticket$/				
			},
			update: {
				rosources: /^ticket$/,
				condition: {
					mongoCond: (params) => {
						return params.user.id === params.post.owner
					}
				}				
			},
			delete: {
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

	constructor(roles) {
        this.init(roles);
	}
	
	init(roles) {
		this.roles = roles;
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

	if (req.routeConfig[req.method].authorization &&
		req.routeConfig[req.method].authorization.authorize &&
		req.routeConfig[req.method].authorization.operationType) {

		const operation = req.routeConfig[req.method].authorization.operationType;
		const auth = new RBAC(roles);

		if(auth.can(req.user.roles, operation).can) {
			console.log('this is authorized object: ', auth.can(req.user.roles, operation));
		} else {
			console.log('this is unauthorized object: ', auth.can(req.user.roles, operation));
		}
		next();

	} else if (req.routeConfig[req.method].authorization &&
				req.routeConfig[req.method].authorization.authorize === false) {
		console.log('auth false');
		next();
	} else {
		// !TODO - log error to server
		console.log('auth error');
		setResponse(req, res, '500');
	}

}

module.exports = {
	authorize
};