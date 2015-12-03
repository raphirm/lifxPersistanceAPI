var express = require('express');
var router = express.Router();
var client = require('../lifx.js');
var config = require('../config.js');
var Color = require('../objects/color.js');
/* show all bulbs. */
router.get('/', function(req, res, next) {
  var bulbs = config.data.bulb;

  res.json(bulbs);
});
router.get('/:lightId', function(req, res, next){
  var bulb;
 config.searchBulbById(req.params.lightId, function(bulb){
    if(!bulb) {
      config.searchBulbByLabel(req.params.lightId, function (bulb) {
        if(!bulb){res.status(404).json({'status': 'bulb not found'});}
        else{res.json(bulb);}
      });
    }else{res.json(bulb);}
  });
});

router.post('/:lightId/color', function(req, res){
  try {
    var color = new Color(req.body);
    config.searchBulbByLabel(req.params.lightId, function(bulb){
      if(!bulb){
        config.searchBulbById(req.params.lightId, function(bulb){
          if(!bulb){res.status(404).json({'status': 'bulb not found'});}
          else{
            bulb.setColor(color);
            res.json(bulb);
          }
        });
      }else{
        bulb.setColor(color);
        res.json(bulb);
      }
    });
  }
  catch(err){
    res.status(501).json({'status': 'error: '+err});
  }
});
router.get('/:lightId/off', function(req, res){
  config.searchBulbById(req.params.lightId, function(bulb){
    if(!bulb){
      config.searchBulbByLabel(req.params.lightId, function(bulb){
        if(!bulb){res.status(404).json({'status': 'bulb not found'});}
        else{
          bulb.turnOff();
          res.json(bulb);
        }
      });
    }
    else{
      bulb.turnOff();
      res.json(bulb);
    }
  });
});
router.get('/:lightId/on', function(req, res){
  config.searchBulbById(req.params.lightId, function(bulb){
    if(!bulb){
      config.searchBulbByLabel(req.params.lightId, function(bulb){
        if(!bulb){res.status(404).json({'status': 'bulb not found'});}
        else{
          bulb.turnOn();
          res.json(bulb);
        }
      });
    }
    else{
      bulb.turnOn();
      res.json(bulb);
    }
  });
});
router.get('/:lightId/toggle', function(req, res){
  config.searchBulbById(req.params.lightId, function(bulb){
    if(!bulb){
      config.searchBulbByLabel(req.params.lightId, function(bulb){
        if(!bulb){res.status(404).json({'status': 'bulb not found'});}
        else{
          bulb.toggle();
          res.json(bulb);
        }
      });
    }
    else{
      bulb.toggle();
      res.json(bulb);
    }
  });
});



module.exports = router;
