var express = require('express');
var router = express.Router();
var client = require('../lifx.js');
var https = require('https');
var config = require('../config.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  var lights = client.lights();
  console.log(lights);
  res.render('index', { title: 'Express', 'lights': lights });
});
router.get('/scene', function(req, res, next) {
  var activate_scene = {
    host: 'api.lifx.com',
    port: '443',
    path: '/v1/scenes/',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+config.data.token,
    }
  };
  var act_req = https.request(activate_scene, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
      res.json(chunk);
    });
  });
  act_req.write('');
  act_req.end();
});
router.get('/scene/:uuid', function(req, res, next) {
  var sceneid = req.params.uuid;
  var activate_scene = {
    host: 'api.lifx.com',
    port: '443',
    path: '/v1/scenes/scene_id:'+sceneid+'/activate',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+config.data.token,
    }
  };
  var act_req = https.request(activate_scene, function(resi) {
    resi.setEncoding('utf8');
    resi.on('data', function (chunk) {
      console.log('Response: ' + chunk);
      res.json(chunk);
    });
  });
  act_req.write('');
  act_req.end();
});


module.exports = router;
