module.exports.generateSessionExirationDate = function (seconds) {
	var now = new Date()
	var offset = (now.getTimezoneOffset() * 60 * 1000) * -1
	var date = new Date(now.getTime() + offset + (seconds * 1000))

	return date
}
