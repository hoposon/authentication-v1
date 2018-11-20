const codes = {
	'200': {
		code: 200,
		success: true,
		data: []
	},
	'204': {
		code: 204,
		success: true,
		data: []
	},
	'400': {
		code: 400,
		success: false,
		error: { 
			errorCode: "BAD_REQUEST",
			message: "Request no in correct format",
			data: {}
		}
	},
	'401': {
		code: 401,
		success: false,
		error: { 
			errorCode: "UNAUTHORIZED",
			message: "Credential do not match",
			data: {}
		}
	},
	'404': {
		code: 404,
		success: false,
		error: { 
			errorCode: "NOT_FOUND",
			message: "Service you are requesting not found",
			data: {}
		}
	},
	'422': {
		code: 422,
		success: false,
		error: { 
			errorCode: "FIELDS_VALIDATION_ERROR",
			message: "One or more fields raised validation errors.",
			data: {}
		}
	},
	'500': {
		code: 500,
		success: false,
		error: { 
			errorCode: "SERVER_ERROR",
			message: "Internal server error",
			data: {}
		}
	}
}

function setResponse(req, res, code, data) {
	const reg = new RegExp(/2[0-9]{2}/);
	if (codes[code]) {
		if (data) {
			if (reg.test(code)) {
				codes[code].data = data;
			} else {
				codes[code].error.data = data;
			}
		}
	}
	res.status(code).send(JSON.stringify(codes[code]));
}

function getResponse(codeName) {
	return codes[codeName] || {code: 500, message: 'Internal Server Error', error: true};
}

module.exports = {
	getResponse,
	setResponse
}