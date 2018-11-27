const codes = {
	'200': {
		code: 200,
		success: true,
		message: 'OK',
		data: {}
	},
	'201': {
		code: 201,
		success: true,
		message: 'Created',
		data: {}
	},
	'204': {
		code: 204,
		success: true,
		message: 'No data dound',
		data: {}
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
	// console.log('code: ', code);
	if (codes[code]) {
		let resp = Object.assign({}, codes[code]);
		// let resp = codes[code];
		// console.log('resp: ', resp);
		if (data) {
			if (reg.test(code)) {
				resp.data = data;
			} else {
				resp.error.data = data;
			}
		}
		// console.log('resp: ', resp);
		res.status(code).send(JSON.stringify(resp));
	} else {
		res.status(500).send(JSON.stringify({
			code: 500,
			success: false,
			error: { 
				errorCode: "SERVER_ERROR",
				message: "Internal server error",
				data: {}
			}
		}));
	}
	
}

function getResponse(codeName) {
	return codes[codeName] || {code: 500, message: 'Internal Server Error', error: true};
}

module.exports = {
	// getResponse,
	setResponse
}