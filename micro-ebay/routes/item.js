// jshint esversion: 6
let express = require('express');
let router = express.Router();
let itemController = require('../controllers/ItemController');
let ensure = require('../utils/ensureLogin');
let multer = require('multer');
let crypto = require('crypto');
let mime = require('mime');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/photos/');
    },
    filename: (req, file, cb) => {
      crypto.pseudoRandomBytes(16, (err, raw) => {
        cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
      });
    }
  });
let upload = multer({storage: storage});

router.get('/add', ensure, itemController.addNewItemView);
router.post('/add/', ensure, upload.single('photo'), itemController.addNewItem);
router.get('/your/all', ensure, itemController.getAllUserItems);

module.exports = router;

