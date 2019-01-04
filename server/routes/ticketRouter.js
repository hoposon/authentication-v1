const express = require('express');
const _ = require('lodash');
const { Ticket } = require('../models/ticketModel');
const {ObjectID} = require('mongodb');

// response codes and massages
const { setResponse } = require('../responses.config');

const router = express.Router();

router.get('/');
router.get('/', getAllTickets);
// !TODO
// router.get('/:ticketId');
// router.get('/:ticketId', getTicketById);
// !TODO some kind of search
router.post('/');
router.post('/', createTicket);
router.put('/:ticketId');
router.put('/:ticketId', updateTicket);
router.post('/:ticketId/comments');
router.post('/:ticketId/comments', createComment);
router.put('/:ticketId/comments/:commentId');
router.put('/:ticketId/comments/:commentId', updateComment);
router.post('/:ticketId/workloads');
router.post('/:ticketId/workloads', createWorkload);


function getAllTickets(req, res, next) {
	Ticket
	.find()
	.populate('_user', '_id firstName lastName email')
	.populate('_project', '_id name')
	.populate('comments._user', '_id firstName lastName email')
	.populate('comments.modified._user', '_id firstName lastName email')
	.populate('modified._user', '_id firstName lastName email')
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

	if(_body._project && !ObjectID.isValid(_body._project)) {
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
		// modified:[{
		// 	_user,
		// 	modifyDate: Date.now()
		// }]
	}

	// set user and modified for a comment
	if (_ticket.comments) {
		const idx = _ticket.comments.length-1;
		_ticket.comments[idx]._user = _user;
		_ticket.comments[idx].createDate = Date.now();
		// _ticket.comments[idx].modified = [{
		// 	_user,
		// 	modifyDate: Date.now()
		// }]
	}

	const ticket = new Ticket(_ticket);
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
	let _body = _.pick(req.body, ['name', 'description', '_state', '_project']);

	if(!ObjectID.isValid(req.params.ticketId)) {
		const errors = {fields: {
			ticketId: {
				kind: 'ObjectID',
				reason: 'Not valid ObjectID'
			}
		}};
        return setResponse(req, res, '422', errors);
	}
	if(_body._project && !ObjectID.isValid(_body._project)) {
		const errors = {fields: {
			_project: {
				kind: 'ObjectID',
				reason: 'Not valid ObjectID'
			}
		}};
        return setResponse(req, res, '422', errors);
    }

	Ticket.findOne({_id: req.params.ticketId}).then((ticket) => {
		if (!ticket) {
			return setResponse(req, res, '404');
		}

		ticket.modified.push({
			_user: req.user._id,
			modifyDate: Date.now()
		})
		_body = {
			..._body,
			modified: ticket.modified
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
	let _body = _.pick(req.body, ['comment']);

	if(!ObjectID.isValid(req.params.ticketId)) {
		const errors = {fields: {
			ticketId: {
				kind: 'ObjectID',
				reason: 'Not valid ObjectID'
			}
		}};
        return setResponse(req, res, '422', errors);
	}

	Ticket.findOne({_id: req.params.ticketId}).then((ticket) => {
		console.log('ticket: ', ticket.comments);
		if (!ticket) {
			return Promise.reject('TICKET_NOT_FOUND');
		}
		ticket.comments.push({
			comment: _body.comment,
			_user: req.user._id,
			createDate: Date.now()
		});
		// ticket.comments[ticket.comments.length - 1].modified.push({
		// 	_user: req.user._id,
		// 	modifyDate: Date.now()
		// });
		return ticket.save();
	}).then(() => {
		return setResponse(req, res, '204');
	}).catch((e) => {
		// if (e.message )
		console.log('create comment error: ', e);
		return setResponse(req, res, '400');
	})
}

function updateComment(req, res, next) {
	let _body = _.pick(req.body, ['comment']);
	console.log('body comment: ', _body);

	if(!ObjectID.isValid(req.params.ticketId)) {
		const errors = {fields: {
			ticketId: {
				kind: 'ObjectID',
				reason: 'Not valid ObjectID'
			}
		}};
        return setResponse(req, res, '422', errors);
	}

	if(!ObjectID.isValid(req.params.commentId)) {
		const errors = {fields: {
			commentId: {
				kind: 'ObjectID',
				reason: 'Not valid ObjectID'
			}
		}};
        return setResponse(req, res, '422', errors);
	}

	Ticket.findOne({_id: req.params.ticketId}).then((ticket) => {
		if (!ticket) {
			return Promise.reject('TICKET_NOT_FOUND');
		}

		for (let i = 0; i < ticket.comments.length; i++) {
			if (ticket.comments[i]._id.toString() === req.params.commentId.toString()) {
				ticket.comments[i].comment = _body.comment;
				ticket.comments[i].modified.push({
					_user: req.user._id,
					modifyDate: Date.now()
				})
				break;
			}
		}
		return ticket.save();
	}).then(() => {
		return setResponse(req, res, '204');
	}).catch((e) => {
		// if (e.message ) !TODO correctly handle save/ticket not found errors/other errors
		console.log('create comment error: ', e);
		return setResponse(req, res, '400');
	})
}

function createWorkload(req, res, next) {
	let _body = _.pick(req.body, ['workloadDate', 'workloadAmount', 'workloadAmountUnit', 'workloadUser']);

	if(!ObjectID.isValid(req.params.ticketId)) {
		const errors = {fields: {
			ticketId: {
				kind: 'ObjectID',
				reason: 'Not valid ObjectID'
			}
		}};
        return setResponse(req, res, '422', errors);
	}

	Ticket.findOne({_id: req.params.ticketId}).then((ticket) => {
		console.log('ticket: ', ticket.workload);
		if (!ticket) {
			return Promise.reject('TICKET_NOT_FOUND');
		}
		
		ticket.workload = _body;
		console.log('ticket.workload: ', ticket);
		// ticket.comments[ticket.comments.length - 1].modified.push({
		// 	_user: req.user._id,
		// 	modifyDate: Date.now()
		// });
		return ticket.save();
	}).then(() => {
		return setResponse(req, res, '204');
	}).catch((e) => {
		// if (e.message )
		console.log('create comment error: ', e);
		return setResponse(req, res, '400');
	})
}

module.exports = router;