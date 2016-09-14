'use strict'

const twilio = require('twilio')

/* client for Twilio TaskRouter */
const taskrouterClient = new twilio.TaskRouterClient(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN,
	process.env.TWILIO_WORKSPACE_SID)

module.exports.delete = function (req, res) {

	taskrouterClient.workspace.workers(req.params.id).delete(null, function (err) {
		if (err) {
			res.status(500).json(err)
		} else {
			res.status(200).end()
		}
	})

}

module.exports.create = function (req, res) {

	taskrouterClient.workspace.workers.create({
		friendlyName: req.body.friendlyName,
		attributes: req.body.attributes
	}, function (err) {
		if (err) {
			res.status(500).json(err)
		} else {
			res.status(200).end()
		}
	})

}

module.exports.list = function (req, res) {

	taskrouterClient.workspace.workers.list(function (err, data) {
		if (err) {
			res.status(500).json(err)
		} else {
			res.status(200).json(data.workers)
		}
	})

}
