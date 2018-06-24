// jshint esversion: 6
let express = require('express');
let router = express.Router();
let accountController = require('../controllers/AccountController');
let ensure = require('../utils/ensureLogin');

router.get('/account', ensure, accountController.showAccountDetails);
router.get('/account/address/add', ensure, accountController.addUserAddressView);
router.post('/account/address/add/new', ensure, accountController.addUserAddress);
router.get('/notifications/all', ensure, accountController.userNotifications);
module.exports = router;
