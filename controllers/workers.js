'use strict'
const config = require('../config')
const authy = require('authy')(config.AUTHY_API_KEY)
const twilio = require('twilio')
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

/* client for Twilio TaskRouter */
const taskrouterClient = new twilio.TaskRouterClient(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN,
	process.env.TWILIO_WORKSPACE_SID)

module.exports.delete = function (req, res) {

	taskrouterClient.workspace.workers(req.params.id).delete(null)
		.then(function (result) {
			res.status(200).end()
		}).catch(function (err) {
			res.status(500).json(err)
		})

}

module.exports.create = function (req, res) {

	var worker = {
		friendlyName: req.body.friendlyName,
		attributes: req.body.attributes
	}
	console.log('body ' , req.body);
	console.log('worker ' , worker.attributes);
	
	if (worker.attributes.phone && worker.attributes.phone.length > 0){
		//register phone with Authy
		console.log('about to reg for authy ' , worker.attributes.phone);
		var countryCode = phoneUtil.parse(worker.attributes.phone).getCountryCode();
		console.log('country code ', countryCode);
	
	    authy.register_user(req.body.friendlyName + '@' + process.env.TWILIO_WORKSPACE_SID + '.com', worker.attributes.phone, countryCode, function (err, authyres) {
	        if (err) {
	            console.log('AUTHY ERROR: ' , err);
				res.status(500).json('Authy: ' + err.message);
	        } else {
				console.log('authy result ', authyres);
	        	worker.attributes.authyId = authyres.user.id;
				worker.attributes = JSON.stringify(worker.attributes);
				taskrouterClient.workspace.workers.create(worker)
				.then(function (worker) {
					res.status(200).json(worker)
				}).catch(function (err) {
					res.status(500).json(err)
				})
				
	        }
	    })
	} else {
		worker.attributes = JSON.stringify(worker.attributes);
		taskrouterClient.workspace.workers.create(worker)
		.then(function (worker) {
			res.status(200).json(worker)
		}).catch(function (err) {
			res.status(500).json(err)
		})
	}
}

module.exports.list = function (req, res) {

	taskrouterClient.workspace.workers.list()
		.then(function (data) {
			res.status(200).json(data.workers)
		}).catch(function (err) {
			res.status(500).json(err)
		})

}
