const codes = {
	'400': {
		code: 400,
		message: 'something is wrong',
		error: true
	},
	'notFound': {
		code: 404,
		message: 'Not Found',
		error: true
	},
	'internalServerError': {
		code: 500,
		message: 'Internal Server Error',
		error: true
	}
}

function getCodeAndMessage(codeName) {
	return codes[codeName] || {code: 500, message: 'Internal Server Error', error: true};
}

module.exports = getCodeAndMessage;