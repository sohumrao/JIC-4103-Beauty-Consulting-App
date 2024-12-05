/**
 * Handles an HTTP error, setting an error message in the
 * UI (if setErrorMessage is provided) orlogging the error message
 * and status code to the console (if consoleLogErrors is true) and/or
 *
 * @param {Error} error - The error object from the HTTP request.
 * @param {Function} [setErrorMessage] - A function that sets the error message
 *   in the UI. If not provided, the error message will be logged to the console.
 * @param {boolean} [consoleLogErrors=true] - Whether to log the error message
 *   and status code to the console.
 */
function handleHTTPError(
	error,
	setErrorMessage = null,
	consoleLogErrors = true
) {
	if (error.isJoi && error.name === "ValidationError") {
		if (setErrorMessage) setErrorMessage(error.message);
		else console.error(error.message);
	} else if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		const errorMessage =
			error.response.data?.message ||
			error.response.data ||
			"An error occurred";
		if (setErrorMessage) setErrorMessage(errorMessage);
		else if (consoleLogErrors) {
			console.error("Server responded with error:", errorMessage);
			console.error("Status code:", error.response.status);
		}
	} else if (error.request) {
		// The request was made but no response was received
		if (setErrorMessage) setErrorMessage("Request Failed");
		if (consoleLogErrors)
			console.error("No response received:", error.request);
	} else {
		// Something else happened
		if (setErrorMessage) setErrorMessage("An unhandled error occurred");
		if (consoleLogErrors) console.error(error.message);
	}
}

export default handleHTTPError;
