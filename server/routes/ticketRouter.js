const express = require('express');
const _ = require('lodash');
const {Ticket} = require('../models/ticketModel');

// response codes and massages
const { setResponse } = require('../responses.config');

const router = express.Router();

router.get('/');
router.get('/', getAllTickets);
router.post('/');
router.post('/', createTicket);


function getAllTickets(req, res, next) {
	Ticket
	.find()
	.populate('user')
	.populate('project')
	.then((tickets) => {
		if(!tickets) {
			setResponse(req, res, '204');
		}
		setResponse(req, res, '200', tickets);
	})
	.catch((e) => {
		console.log(e);
		// console.log(e);
		setResponse(req, res, '500');
	})
}

function createTicket(req, res, next) {
	const body = req.body;
	const ticket = new Ticket({
		...body,
		_creator: {
			_id: req.user._id,
			email: req.user.email,
			firstName: req.user.firstName || '',
			lastName: req.user.lastName || '',
		},
		modifiedBy:[{
			_id: req.user._id,
			email: req.user.email,
			firstName: req.user.firstName || '',
			lastName: req.user.lastName || '',
		}]
	});
	// console.log('pproject: ', project);
	ticket.save().then((ticket) => {
		if(!ticket) {
			return Promise.reject();
		}
		setResponse(req, res, '200', [ticket]);
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