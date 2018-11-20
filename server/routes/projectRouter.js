const express = require('express');
const _ = require('lodash');
const {Project} = require('../models/projectModel');
const {ObjectID} = require('mongodb');

// response codes and massages
const { setResponse } = require('../responses.config');

const router = express.Router();

router.get('/');
router.get('/', getAllProjects);
router.post('/');
router.post('/', addProject);

function getAllProjects(req, res, next) {

	Project
	.find()
	.populate('user')
	.then((projects) => {
		if(projects === {}) {
			setResponse(req, res, '204');
		}
		setResponse(req, res, '200', projects);
	})
	.catch((e) => {
		console.log(e);
		// console.log(e);
		setResponse(req, res, '500');
	})
}

function addProject(req, res, next) {
	const body = _.pick(req.body, ['name', 'description']);
	const project = new Project({
		...body, 
		_creator: {
			_id: req.user._id,
			email: req.user.email,
			firstName: req.user.firstName || '',
			lastName: req.user.lastName || '',
		}
	});
	// console.log('pproject: ', project);
	project.save().then((project) => {
		if(!project) {
			return Promise.reject();
		}
		setResponse(req, res, '200', [project]);
	})
	.catch((e) => {
		if (e && e.name && e.name === 'ValidationError') {
			const errors = {fields: {}};
			if (e.errors) {
				for (const err in e.errors) {
					errors.fields[e.errors[err].path]	= {kind: e.errors[err].kind, reason: e.errors[err].reason}
				}
			}
			setResponse(req, res, '422', errors);
		} else {
			setResponse(req, res, '500');
		}
		
	})
}

module.exports = router;