var express = require('express');
var router = express.Router();
var client = require('../lifx.js');
var config = require('../config.js');
var Color = require('../objects/color.js');
var Group = require('../objects/group.js');
var Flicker = require('../objects/flicker.js');
/* show all bulbs. */
router.get('/', function(req, res, next) {
  var bulbs = config.data.bulb;

  res.json(bulbs);
});

function removeFlicker(id){
  if(id instanceof Group){
    id.bulb.forEach(function(b){
      config.data.flicker.forEach(function(flicker){
        if(flicker.bulb == b){
          config.data.flicker.splice(config.data.flicker.indexOf(b), 1);
        }
      })
    })

  }else{
    config.data.flicker.forEach(function(flicker){
      if(flicker.bulb == id){
        config.data.flicker.splice(config.data.flicker.indexOf(id), 1);
      }
    })
  }
}
router.get('/:idOrName', function(req, res){
  try {
      var strength = 25;
      if (req.query.strength){
        strength = req.query.strength;
      }
      var destiny = 60;
    if (req.query.destiny){
      destiny = req.query.destiny;
    }
      var bulb = req.params.idOrName;
      config.searchBulbById(bulb, function(b){
        if(b){
          b.update();
          var f = new Flicker(strength, destiny, b);
          config.data.flicker.push(f);
          config.persist(config.file, function(){});
          res.json(f);
        }else {
          config.searchBulbByLabel(bulb, function (b) {
            if(b){
              b.update();
              var f = new Flicker(strength, destiny, b);
              config.data.flicker.push(f);
              config.persist(config.file, function(){});
              res.json(f);
            }else {
              config.searchGroupById(bulb, function (g) {
                if(g){
                  g.bulb[0].update()
                  var f = new Flicker(strength, destiny, g.bulb[0]);
                  config.data.flicker.push(f);
                  config.persist(config.file, function(){});
                  res.json(f);
                }else {
                  config.searchGroupByName(bulb, function (g) {
                    if(g){
                      g.bulb[0].update()
                      var f = new Flicker(strength, destiny, g.bulb[0]);
                      config.data.flicker.push(f);
                      config.persist(config.file, function(){});
                      res.json(f);
                    }else {
                      res.statusCode(404).json({"status": "group or bulb not found"});
                    }
                  })

                }
              })
            }
          })

        }
      })

  }
  catch(err){
    res.status(501).json({'status': 'error: '+err});
  }
});
router.get('/:idOrName/delete', function(req, res){
  try {
    var strength = req.query.strength;
    if (!strength){
      strength = 25;
    }
    var bulb = req.params.idOrName;
    config.searchBulbById(bulb, function(b){
      if(b){

        removeFlicker(b);
        config.persist(config.file, function(){});
        res.json();
      }else {
        config.searchBulbByLabel(bulb, function (b) {
          if(b){
            removeFlicker(b);
            config.persist(config.file, function(){});
            res.json();
          }else {
            config.searchGroupById(bulb, function (g) {
              if(g){
                removeFlicker(g);
                config.persist(config.file, function(){});
                res.json();
              }else {
                config.searchGroupByName(bulb, function (g) {
                  if(g){
                    removeFlicker(g);
                    config.persist(config.file, function(){});
                    res.json();
                  }else {
                    res.statusCode(404).json({"status": "group or bulb not found"});
                  }
                })

              }
            })
          }
        })

      }
    })

  }
  catch(err){
    res.status(501).json({'status': 'error: '+err});
  }
});





module.exports = router;
