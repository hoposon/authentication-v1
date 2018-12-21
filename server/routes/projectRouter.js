const express = require('express');
const _ = require('lodash');
const {Project} = require('../models/projectModel');

// response codes and massages
const { setResponse } = require('../responses.config');

const router = express.Router();

router.get('/');
router.get('/', getAllProjects);
router.post('/');
router.post('/', createProject);

function getAllProjects(req, res, next) {

	Project
	.find()
	.populate('_user', '_id firstName lastName email')
	// .populate('_user')
	.then((projects) => {
		if(projects.length === 0) {
			return setResponse(req, res, '204');
		}
		return setResponse(req, res, '200', projects);
	})
	.catch((e) => {
		// console.log(e);
		// console.log(e);
		return setResponse(req, res, '500');
	})
}

function createProject(req, res, next) {
	const body = _.pick(req.body, ['name', 'description']);
	const project = new Project({
		...body, 
		_user: req.user._id
	});
	project.save().then((retProject) => {
		if(!retProject) {
			return Promise.reject();
		}
		return setResponse(req, res, '200', [retProject]);
	})
	.catch((e) => {
		if (e && e.name && e.name === 'ValidationError') {
			const errors = {fields: {}};
			if (e.errors) {
				for (const err in e.errors) {
					errors.fields[e.errors[err].path]	= {kind: e.errors[err].kind, reason: e.errors[err].reason}
				}
			}
			return setResponse(req, res, '422', errors);
		} else {
			return setResponse(req, res, '500');
		}
		
	})
}

module.exports = router;