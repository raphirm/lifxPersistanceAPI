var express = require('express');
var router = express.Router();
var client = require('../lifx.js');
var config = require('../config.js');
var Group = require('../objects/group.js');
var Color = require('../objects/color.js');
var Timeline = require('../objects/timeline.js');
/* show all bulbs. */
router.get('/', function(req, res, next) {
  var timeline = config.data.timeline;

  res.json(timeline);
});
router.put('/', function(req, res){
  var t = req.body;
  var id = Math.random().toString(36).substring(2);

  try {
    if(t.time[0]=='now'){
      t.time[0] = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds();
    }
    var timeline = new Timeline(id, t.time, t.color, t.device);

    config.data.timeline.push(timeline);
    config.persist(config.file, function(){});
    res.json(timeline);
  }catch(err){
    res.status(501).json({'status': 'error:'+err});
  }
//tbd
});
module.exports = router;
