// routes configuration
const { routesConfig } = require('../routes/routes.config');

let roles = {
	superAdmin: {
		inherits: ['admin']
	},
	admin: {
		can: [{
			operation: 'edit'
		}],
		inherits: ['user']
    },
    user: {
		can: [{
			operation: 'read'
		}, {
			operation: 'create'
		}, {
			operation: 'edit',
			mongoCond: (params) => {
				return params.user.id === params.post.owner
			}
		}]
    }
}

class RBAC {

	constructor(opts) {
        this.init(opts);
	}
	
	init(roles) {
        if(typeof roles !== 'object') {
            throw new TypeError('Expected an object as input');
        }
    
        this.roles = roles;
        let map = {};
        Object.keys(roles).forEach(role => {
            map[role] = {
                can: {}
            };
            if(roles[role].inherits) {
                map[role].inherits = roles[role].inherits;
            }
      
            roles[role].can.forEach(operation => {
                if(typeof operation === 'string') {
                    map[role].can[operation] = 1;
                } else if(typeof operation.name === 'string'
                    && typeof operation.when === 'function') {
        
                    map[role].can[operation.name] = operation.when;
                }
                // Ignore definitions we don't understand
            });
    
        });
    
        this.roles = map;
	}
	
	// can(role, operation, params) {
	// 	// Check if role exists
	// 	if(!this.roles[role]) {
	// 		return false;
	// 	}
	// 	let _role = this.roles[role];
	// 	// Check if this role has this operation
	// 	if(_role.can[operation]) {
	// 		// Not a function so we are good
	// 		if(typeof _role.can[operation] !== 'function') {
	// 			return true;
	// 		}
	// 		// If the function check passes return true
	// 		if(_role.can[operation](params)) {
	// 			return true;
	// 		}
	// 	}
	  
	// 	// Check if there are any parents
	// 	if(!_role.inherits || _role.inherits.length < 1) {
	// 		return false;
	// 	}
	  
	// 	// Check child roles until one returns true or all return false
	// 	return _role.inherits.some(childRole => this.can(childRole, operation, params));
	// }

	sortByInheritance(roles) {
		let sorted = [];
		for (const forRole of roles) {
			if(!this.roles[forRole]) {
				// !TODO log user has role that does not exist in roles
				// return false;
				continue;
			}

			if (this.roles[forRole].inherits) {
				for (const desc in this.roles[forRole].inherits) {
					let histIdx = 0;
					let sortIdx = sorted.indexOf({roleName: desc});
					if(sortIdx >= 0) {
						histIdx = sortIdx < histIdx ? sortIdx : histIdx;
					} else {
						sorted.unshift({
							roleName: desc,
							level: 
						})
					}

				}
				
			}
		}
	}

	can(roles, operation, condType) {

		let hasRole = false;
		// Check if roles exist
		for (const forRole of roles) {
			if(!this.roles[forRole]) {
				// !TODO log user has role that does not exist in roles
				// return false;
				continue;
			}

			let _role = this.roles[forRole];
			// Check if this role has this operation
			if(_role.can[operation]) {
				// Not a function so we are good
				if(typeof _role.can[operation] !== 'function') {
					return true;
				}
				// If the function check passes return true
				if(_role.can[operation](params)) {
					return true;
				}
			}
		}
		
		
	  
		// Check if there are any parents
		if(!_role.inherits || _role.inherits.length < 1) {
			return false;
		}
	  
		// Check child roles until one returns true or all return false
		return _role.inherits.some(childRole => this.can(childRole, operation, params));
	}


	fsdfs(roles, startLevel) {
		level = startLevel;
		sorted = [];
		for (r of roles) {
			t = this.roles[r]
			if (t.inheritance) {
				this.fsdfs(t.inheritance, level)
			} else {
				sorted.push({name:t, level: level--})
			}
		}
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