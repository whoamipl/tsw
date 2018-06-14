// jshint esversion: 6
let mongoose = require("mongoose");
let User = require("../models/user");
let accountController = {};

accountController.showAccountDetails = function (req, res, next) {
    res.render('account', {
        // username: req.user.username,
        // firstName: "Michał",
        // lastName: "Fierek",
        // eMail: "mfierek@protonmail.ch",
        // phoneNumber: "number",
        // adressesArr: ["Adres 1", "Adres 2", "Adres 3"]
        user: req.user
    });
};

module.exports = accountController;