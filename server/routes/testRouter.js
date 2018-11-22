const express = require('express');
const router = express.Router();
// response codes and massages
const { setResponse } = require('../responses.config');

// routes
router.get('/test', test);
router.get('/test/fooauthenticated', fooauthenticated);

function test(req, res, next) {

	let roles = {
		superAdmin: {
			inherits: ['admin']
		},
		admin: {
			can: [{
				operation: 'edit'
			}],
			inherits: ['user', 'userU', 'userT']
		},
		adminT: {
			can: [{
				operation: 'edit'
			}],
			inherits: ['userT']
		},
		adminU: {
			can: [{
				operation: 'edit'
			}],
			inherits: ['userU']
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
		},
		userU: {
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
		},
		userT: {
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


	let acl = new RBAC(roles);
	acl.s(['user', 'admin', 'superAdmin', 'adminT', 'adminU'], 0);
	console.log('sorted arr: ', acl.sorted);
	setResponse(req, res, '200', {message: 'OK, /test/test'});
}

function fooauthenticated(req, res, next) {
	setResponse(req, res, '200', {message: 'OK, authentication works'});
}



class RBAC {

	constructor(opts) {
		this.roles = opts;
		this.sorted = [];
	}

	s(roles, startLevel) {
		let level = startLevel;
		for (const r of roles) {
			let t = this.roles[r];
			if (t.inherits) {
				this.sorted.push({name:r, level: level--})
				this.s(t.inherits, level)
			} else {
				this.sorted.push({name:r, level: level--})
			}
		}
	}
}



module.exports = router;