const express = require('express');
const _ = require('lodash');
const { Ticket } = require('../models/ticketModel');
const {ObjectID} = require('mongodb');

// response codes and massages
const { setResponse } = require('../responses.config');

const router = express.Router();

router.get('/');
router.get('/', getAllTickets);
router.post('/');
router.post('/', createTicket);
router.put('/:id');
router.put('/:id', updateTicket);
router.post('/:id/comments');
router.post('/:id/comments', createComment);
router.put('/:id/comments/:id');
router.put('/:id/comments/:id', updateComment);


function getAllTickets(req, res, next) {
	Ticket
	.find()
	.populate('_user', '_id firstName lastName email')
	.populate('_project', '_id name')
	.then((tickets) => {
		if(!tickets) {
			return setResponse(req, res, '204');
		}
		return setResponse(req, res, '200', tickets);
	})
	.catch((e) => {
		// console.log(e);
		// console.log(e);
		return setResponse(req, res, '500');
	})
}

function createTicket(req, res, next) {
	const _body = req.body;

	if(!ObjectID.isValid(_body._project._id)) {
		const errors = {fields: {
			_project: {
				kind: 'ObjectID',
				reason: 'Not valid ObjectID'
			}
		}};
        return setResponse(req, res, '422', errors);
    }

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
	// console.log('_ticket: ', _ticket);
	ticket.save().then((retTicket) => {
		if(!retTicket) {
			return Promise.reject();
		}
		return setResponse(req, res, '200', [retTicket]);
	})
	.catch((e) => {
		
		if (e && e.name && e.name === 'ValidationError') {
			const errors = {fields: {}};
			if (e.errors) {
				for (const err in e.errors) {
					// console.log(toString(e.errors[err].reason));
					errors.fields[e.errors[err].path] = {kind: e.errors[err].kind, reason: e.errors[err].reason || `${e.errors[err].kind} not found`}
				}
			}
			return setResponse(req, res, '422', errors);
		} else {
			return setResponse(req, res, '500');
		}
		
	})
}

function updateTicket(req, res, next) {
	let _body = _.pick(req.body, ['_id', 'name', 'description', '_state', '_project']);

	if(!ObjectID.isValid(_body._id)) {
		const errors = {fields: {
			_id: {
				kind: 'ObjectID',
				reason: 'Not valid ObjectID'
			}
		}};
        return setResponse(req, res, '422', errors);
	}
	
	if(!ObjectID.isValid(_body._project)) {
		const errors = {fields: {
			_project: {
				kind: 'ObjectID',
				reason: 'Not valid ObjectID'
			}
		}};
        return setResponse(req, res, '422', errors);
    }

	const _user = req.user._id;
	Ticket.findOne({_id: _body._id}).then((ticket) => {
		if (!ticket) {
			return setResponse(req, res, '404');
		}
		ticket.modified.push({
			_user,
			modifyDate: Date.now()
		})
		_body = {
			..._body,
			modified:ticket.modified
		}
		ticket.updateOne({$set: _body}).then((retTicket) => {
			return setResponse(req, res, '204');
		}).catch((e => {
			if (e && e.name && e.name === 'ValidationError') {
				const errors = {fields: {}};
				if (e.errors) {
					for (const err in e.errors) {
						errors.fields[e.errors[err].path] = {kind: e.errors[err].kind, reason: e.errors[err].reason || `${e.errors[err].kind} not found`}
					}
				}
				return setResponse(req, res, '422', errors);
			} else {
				return setResponse(req, res, '500');
			}
		}))
	})
}

function createComment(req, res, next) {
	return setResponse(req, res, '204');
}

function updateComment(req, res, next) {
	return setResponse(req, res, '204');
}

module.exports = router;