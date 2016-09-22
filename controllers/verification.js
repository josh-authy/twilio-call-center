'use strict'

//var authy = require('authy-client').process.env.AUTHY_API_KEY;

const Client = require('authy-client').Client;
const client = new Client({key: process.env.AUTHY_API_KEY});

module.exports.requestToken = function (req, res) {
	var authyId = req.body.authyId;
    var forceVal = Boolean(req.body.force) || false;
    console.log(authyId);
    console.log(forceVal);
    client.requestSms({authyId: authyId}, {force: forceVal}, function (err, authyres) {

        if (err) {
            console.log('error: ', err);
            res.status(500).json(err);
            return;
        }
        console.log("SMS Response: " + JSON.stringify(authyres));
        res.status(200).json({"success": "SMS Sent"});
    });
};

module.exports.verifyToken = function (req, res) {
	var authyId = req.body.authyId;
	var token = req.body.token;

	client.verifyToken({authyId: authyId, token: token}, function (err, authyResponse) {
        if (err) {
            console.log('Verify Token Error Response ', err);
            res.status(500).send({'error': err});
        } else if (!authyResponse.success) {
            console.log('token failure')
            res.status(500).json({"failure": "Token Invalid"});
        } else {
            console.log('token success');
            res.status(200).json({"success": "Token Valid"});
        }
    });
};



