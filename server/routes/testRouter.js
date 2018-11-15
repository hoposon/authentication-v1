const express = require('express');
const router = express.Router();
// response codes and massages
const { setResponse } = require('../responses.config');

// routes
router.get('/test', test);
router.get('/test/fooauthenticated', fooauthenticated);

function test(req, res, next) {
	setResponse(req, res, '200', {message: 'OK, /test/test'});
}

function fooauthenticated(req, res, next) {
	setResponse(req, res, '200', {message: 'OK, authentication works'});
}

module.exports = router;