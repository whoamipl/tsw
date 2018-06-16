// jshint esversion: 6
let express = require('express');
let router = express.Router();
let itemController = require('../controllers/ItemController');
let ensure = require('../utils/ensureLogin');

router.get('/all', itemController.getAllItems);
router.get('/latest', itemController.getLatestItems);
router.get('/:id', ensure, itemController.getItemById);
router.get('/your/:id', ensure, itemController.getUserItemById);
router.get('/your/all', ensure, itemController.getAllUserItems);
router.get('/add', ensure, itemController.addNewItemView);


module.exports = router;
