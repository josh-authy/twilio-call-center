'use strict'

const config = ('../config')
const authy = require('authy')(config.AUTHY_API_KEY)


module.exports.createUser = function (req, res) {
    console.log("create user: ", req.body)
    res.status(200).json({"we":"good"});
};