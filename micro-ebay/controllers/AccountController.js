// jshint esversion: 6
let mongoose = require("mongoose");
let User = require("../models/user");
let accountController = {};

accountController.showAccountDetails = function (req, res, next) {
    res.render('account', {user: req.user});
};

module.exports = accountController;