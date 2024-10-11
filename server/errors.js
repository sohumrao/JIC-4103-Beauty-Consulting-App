class MalformedRequestError extends Error {
	// request was not in the right format i.e. missing fields, wrong types
	statusCode = 400;
}
class UnauthorizedError extends Error {
	// request was not authorized, i.e. not logged in
	statusCode = 401;
}

class ConflictError extends Error {
	// request tried to do something that conflicts with the state of the server
	statusCode = 409;
}

class BadGatewayError extends Error {
	// our server was acting as a middleman to some other server that failed
	statusCode = 502;
}

class NotImplementedError extends Error {
	// request type not supported, i.e. sending a POST request to a GET route
	statusCode = 501;
}

const notImplementedHandler = (req, res, next) => {
	const route = app._router.stack
		.filter((r) => r.route && r.route.path === req.path)
		.pop();

	if (route) {
		const supportedMethods = Object.keys(route.route.methods)
			.filter((method) => route.route.methods[method])
			.map((method) => method.toUpperCase());

		if (!supportedMethods.includes(req.method)) {
			next(
				NotImplementedError(
					`${req.method} is not supported for this route.`
				)
			);
		}
	}
};

// There are three different situations where you may throw an error
// Middleware: call "return next(error)""
// - synchronous: Express will automatically catch the error
// - asynchronous: wrap the function with asyncHandler
// Middleware that returns a promise: you can omit "next" and just return the error
// Non-middleware function: throw an exception and make sure the calling function can handle it
// For more details, see the Github Wiki
const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	if (statusCode >= 500) console.error(err.stack);
	res.status(statusCode);
	res.json({
		message: err.message,
	});
};

export {
	MalformedRequestError,
	UnauthorizedError,
	ConflictError,
	BadGatewayError,
	NotImplementedError,
	errorHandler,
};
