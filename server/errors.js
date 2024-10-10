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
