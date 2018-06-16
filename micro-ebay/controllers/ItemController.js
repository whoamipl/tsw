// jshint esversion: 6
let mongoose = require("mongoose");
let User = require("../models/user");
let Item = require("../models/item");
let itemController = {};

itemController.getAllItems = (req, res, next) => {
    res.send(500);
};

itemController.getLatestItems = (req, res, next) => {
    res.render('userItems', {user: req.user});
};

itemController.getItemById = (req, res, next) => {
    res.render('userItems', {user: req.user});
};

itemController.getUserItemById = (req, res, next) => {
    res.sendStatus(501);
};

itemController.getAllUserItems = (req, res, next) => {
    res.render('userItems');
};

itemController.addNewItemView = (req, res, next) => {
    console.log(res.render('newItem', {user: req.user}));
};

itemController.editItemView = (req, res, next) => {
    res.render('editItem', {user: req.user});
};

itemController.removeItem = (req, res, next) => {
    res.sendStaus(501);
};

module.exports = itemController;
