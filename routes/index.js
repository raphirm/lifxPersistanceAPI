var express = require('express');
var router = express.Router();
var client = require('../lifx.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  var lights = client.lights();
  console.log(lights);
  res.render('index', { title: 'Express', 'lights': lights });
});

module.exports = router;
