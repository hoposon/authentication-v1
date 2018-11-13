const express = require('express');
const router = express.Router();

// routes
router.get('/test', test);

function test(req, res, next) {
	console.log('req.header: ', req.headers);
	res.send({message: 'fine'});
}


module.exports = router;