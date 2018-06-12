// jshint esversion: 6
let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/youraccount', (req, res, next) => {
  
});

module.exports = router;
