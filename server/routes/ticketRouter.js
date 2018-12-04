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
	.populate('_user', '_id firstName lastName email')
	.populate('_project', '_id name')
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
	const _body = req.body;

	const _user = req.user._id;
	let _ticket = {
		..._body,
		_user,
		createDate: Date.now(),
		modified:[{
			_user,
			modifyDate: Date.now()
		}]
	}

	// set user and modified for a comment
	if (_ticket.comments) {
		const idx = _ticket.comments.length-1;
		_ticket.comments[idx]._user = _user;
		_ticket.comments[idx].createDate = Date.now();
		_ticket.comments[idx].modified = [{
			_user,
			modifyDate: Date.now()
		}]
	}

	const ticket = new Ticket(_ticket);
	// console.log('pproject: ', project);
	ticket.save().then((retTicket) => {
		if(!retTicket) {
			return Promise.reject();
		}
		setResponse(req, res, '200', [retTicket]);
	})
	.catch((e) => {
		// console.log(e.errors[err].reason);
		if (e && e.name && e.name === 'ValidationError') {
			const errors = {fields: {}};
			if (e.errors) {
				for (const err in e.errors) {
					errors.fields[e.errors[err].path] = {kind: e.errors[err].kind, reason: e.errors[err].reason || `${e.errors[err].kind} not found`}
				}
			}
			setResponse(req, res, '422', errors);
		} else {
			setResponse(req, res, '500');
		}
		
	})
}

module.exports = router;