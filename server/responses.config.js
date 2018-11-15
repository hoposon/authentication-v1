const codes = {
	'200': {
		code: 200,
		success: true,
		data: []
	},
	'400': {
		code: 400,
		success: false,
		errors: [{ 
			errorCode: "BAD_REQUEST",
			message: "Request no in correct format"
		}]
	},
	'401': {
		code: 401,
		success: false,
		errors: [{ 
			errorCode: "UNAUTHORIZED",
			message: "Credential do not match"
		}]
	},
	'404': {
		code: 404,
		success: false,
		errors: [{ 
			errorCode: "NOT_FOUND",
			message: "Service you are requesting not found"
		}]
	},
	'500': {
		code: 500,
		success: false,
		errors: [{ 
			errorCode: "SERVER_ERROR",
			message: "Internal server error"
		}]
	}
}

function setResponse(req, res, code, data) {
	const reg = new RegExp(/2[0-9]{2}/);
	if (codes[code]) {
		if (data) {
			if (reg.test(code)) {
				codes[code].data = [
					data
				]
			} else {
				codes[code].error = [
					data
				]
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