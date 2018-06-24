// jshint esversion: 6
let mongoose = require("mongoose");
let User = require("../models/user");
let Address = require("../models/address");
let accountController = {};

accountController.showAccountDetails = (req, res, next) => {
    res.render('account', {
        user: req.user
    });
};

accountController.addUserAddressView = (req, res, next) => {
    res.render('addAddress', {
        user: req.user
    });
};

accountController.addUserAddress = (req, res, next) => {
    if (req.body) {
        let newAddress = new Address({
            street: req.body.street,
            number: req.body.number,
            city: req.body.city,
            zip: req.body.zip
        });
        User.findOne({'_id': req.user.id}, 
        (err, user) => {
            user.addresses.push(newAddress);
            user.save((err, data) => {
                res.render('addAddress', {user: req.user, message: data});
            });
        });
    }
};

accountController.userNotifications = (req, res, next) => {
    let userId = req.user.id;
    res.io.on('connection', (socket) => {
        socket.on('read all', () => {
            User
                .findById(userId) 
                .exec((err, user) => {
                    user.hasUnread = false;
                    user.notifications.forEach(ntf => {
                        ntf.isRead = true;
                    });
                    user.save();
                });
        });
    });
    res.render('notifications', {user: req.user});
};
module.exports = accountController;