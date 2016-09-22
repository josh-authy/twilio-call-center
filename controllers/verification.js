'use strict'

//var authy = require('authy-client').process.env.AUTHY_API_KEY;

const Client = require('authy-client').Client;
const client = new Client({key: process.env.AUTHY_API_KEY});

module.exports.requestToken = function (req, res) {
	var authyId = req.body.authyId;

    client.requestSms({authyId: authyId}, function (err, authyres) {

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
            userSockets[user.username].emit('tokenDenied', {'error': authyResponse});
        } else {
            console.log('token success');
            userSockets[user.username].emit('tokenSuccess', {'transType': transType});
        }
        res.status(200).send('token verification processed');
    });
};

module.exports.entry = function (req, res) {

};



