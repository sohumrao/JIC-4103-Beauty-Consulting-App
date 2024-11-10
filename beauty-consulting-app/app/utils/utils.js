function formatDate(date) {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function formatTime(date) {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "numeric",
	});
}

export { formatDate, formatTime };
