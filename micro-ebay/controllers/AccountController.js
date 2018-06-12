// jshint esversion: 6
let mongoose = require("mongoose");
let User = require("../models/user");
let accountController = {};

accountController.accountDetails = (req, res) => {
    passport.authenticate('local')(req, res,() => {
        res.render('account');
    });
};

module.exports = accountController;