// jshint esversion: 6
let mongoose = require('mongoose');
let Item = require('../models/item');
let User = require('../models/user');
let fs = require('fs');
let multer = require('multer');
let itemController = {};

itemController.getAll = (req, res, next) => {
    try {
        let perPage = 3;
        let page = req.query.page > 0 ? req.query.page : 0;
        console.log(page);
        res.locals.createPagination = function (pages, page) {
            let url = require('url');
            let qs = require('querystring');
            let params = qs.parse(url.parse(req.url).query);
            let paginationList = '';
            
            params.page = 0;
            paginationList += '<li class="page-item"><a href="?'+qs.stringify(params)+'" class="page-link">Pierwsza</a></li>';
            for (var p = 1; p < pages; p++) {
              params.page = p;
              paginationList += '<li class="page-item"><a href="?'+qs.stringify(params)+'"class="page-link">'+ p +'</a></li>';
            }
            params.page = --p;
            paginationList += '<li class="page-item"><a href="?'+qs.stringify(params)+'" class="page-link" >Ostatnia</a></li>';
          
            return paginationList;
          };
        Item
            .find()
            .limit(perPage)
            .skip(perPage * page)
            .sort({dateStart: 'desc'})
            .exec((err, items ) => {
                Item
                    .count()
                    .exec((err, count) => {
                        res.render('allItems', 
                        { user: req.user, 
                          items: items, 
                          page: page, 
                          pages: count / perPage
                        });
                    });
            });
    } catch (err) {
        console.log(err);
    }
};

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
            newItem.img.contentType = 'image/png';
            newItem.price = req.body.price;
            newItem.description = req.body.description;
            newItem.owner = req.user.id;
            if(req.body.buyNow === 'on') {
                newItem.isBuyNow = true;
            } 
            else {
                newItem.isBuyNow = false;
                newItem.dateEnd = new Date(req.body.endDate).setHours(23);
            }
            newItem.save();

            User.findOne({'_id' : req.user.id},
            (err, user) => {   
                user.items.push(newItem);   
                user.save((err,data) => {
                    res.render('addItem', {user: req.user});
                });
            });
        }
        catch (err) {
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

itemController.getItemById = (req, res, next) => {
    let isUserItem = false;
    let itemId = req.params.id;
    res.io.on('connection', () => {
        console.log('New user conected');
    });
    Item.findById(itemId)
    .exec((err, item) => {
        if (req.user) {
            if (item.owner == req.user.id) {
                isUserItem = true;
            }
        }
        res.render('itemView', {user: req.user, item: item, isUserItem: isUserItem });
    });
};

module.exports = itemController;