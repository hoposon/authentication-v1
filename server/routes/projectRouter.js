const express = require('express');
const _ = require('lodash');
const {Project} = require('../models/projectModel');

// response codes and massages
const { setResponse } = require('../responses.config');

const router = express.Router();

router.get('/');
router.get('/', getAllProjects);
router.post('/');
router.post('/', addProject);

function getAllProjects(req, res, next) {

	Project.find().then((projects) => {
		if(projects === {}) {
			setResponse(req, res, '204', projects);
		}
		setResponse(req, res, '200', projects);
	})
}

function addProject(req, res, next) {
	const body = _.pick(req.body, ['name', 'description', '_creator']);
	const project = new Project({...body, _creator: req.user._id});

	project.save().then((project) => {
		if(!project) {
			return Promise.reject();
		}
		setResponse(req, res, '200', project);
	})
	.catch((e) => {
		// console.log(e);
		setResponse(req, res, '500');
	})
}

module.exports = router;