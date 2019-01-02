const express = require('express');
const _ = require('lodash');
const { TimeUnit } = require('../models/timeUnitModel');

// response codes and massages
const { setResponse } = require('../responses.config');

const router = express.Router();

router.post('/');
router.post('/', createUnit);
router.delete('/:unitId');
router.delete('/:unitId', deleteUnit);


function createUnit(req, res, next) {
	const body = _.pick(req.body, ['unitCode', 'unitCodeName']);
	const unit = new TimeUnit(body);
	unit.save().then((retUnit) => {
		if(!retUnit) {
			return Promise.reject();
		}
		return setResponse(req, res, '200', [retUnit]);
	})
	.catch((e) => {
		console.log(e);
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

function deleteUnit(req, res, next) {

}



module.exports = router;