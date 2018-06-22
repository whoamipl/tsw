// jshint esversion: 6
let mongoose = require('mongoose');
let Item = require('../models/item');
let User = require('../models/user');
let fs = require('fs');
let multer = require('multer');
let itemController = {};

itemController.addNewItemView = (req, res, next) => {
    res.render('addItem', {user: req.user});
};

itemController.addNewItem = (req, res, next) => {
    if (req.body) {
        try {
            let newItem = new Item();
            newItem.title = req.body.title;
            newItem.img.data = fs.readFileSync(req.file.path);
            newItem.img.filename = req.file.filename;
            console.log(req.file.filename);
            newItem.img.contentType = 'image/png';
            newItem.price = req.body.price;
            newItem.description = req.body.description;
            if(req.body.buyNow === 'on') {
                newItem.isBuyNow = true;
            } 
            else {
                newItem.isBuyNow = false;
                newItem.dateEnd = new Date(req.body.endDate).setHours(23);
            }
            newItem.save((err, data) => {
                console.log(data);
                console.log(err);
            });

            User.findOne({'_id' : req.user.id},
            (err, user) => {
                if (err) console.log(err);     
                user.items.push(newItem);   
                user.save((err,data) => {
                    res.render('addItem', {user: req.user, message: data});
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    }
};

itemController.getAllUserItems = (req, res, next) => {
    User.find({_id: req.user.id})
        .populate('items')
        .exec((err, itemList) => {
            console.log(itemList);
            res.render('userItems', {user: req.user, items: itemList[0].items});
        });
};
module.exports = itemController;