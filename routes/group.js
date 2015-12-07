var express = require('express');
var router = express.Router();
var client = require('../lifx.js');
var config = require('../config.js');
var Group = require('../objects/group.js');
var Color = require('../objects/color.js');

/* show all bulbs. */
router.get('/', function(req, res, next) {
  var groups = config.data.group;

  res.json(groups);
});
router.put('/:groupId', function(req, res){
  var g = req.body;
  var bulbs = new Array();
  g.bulb.forEach(function(bname){
    config.searchBulbById(bname, function(bulb){
      if(!bulb){
        config.searchBulbByLabel(bname, function(bulb){
          if(!bulb){
            res.status(404).json({'status': 'bulb not found'});
          }else{
            bulbs.push(bulb);
          }
        })
      }else{
        bulbs.push(bulb);
      }
    })
  });
  try {
    var group = new Group(req.params.groupId, g.name, bulbs);
    config.data.group.push(group);
    config.persist(config.file, function(){});
    res.json(group);
  }catch(err){
    res.status(501).json({'status': 'error:'+err});
  }
//tbd
});
router.post('/:groupId', function(req, res){
  config.searchGroupById(req.params.groupId, function(group){
    var b = req.body.bulb;
    var bulbs = new Array();
    b.forEach(function(bname){
      config.searchBulbById(bname, function(bulb){
        if(!bulb){
          config.searchBulbByLabel(bname, function(bulb){
            if(!bulb){
              res.status(404).json({'status': 'bulb not found'});
            }else{
              bulbs.push(bulb);
            }
          })
        }else{
          bulbs.push(bulb);
        }
      })
    });
    try {
      group.bulb = bulbs;
      config.persist(config.file, function(){});
      res.json(group);
    }catch(err){
      res.status(501).json({'status': 'error:'+err});
    }
  });
//tbd
});
router.delete('/:groupId', function(req, res){
  config.searchGroupById(req.params.groupId, function(group){
    var i = config.data.group.indexOf(group)
    config.data.group.splice(i, 1);
    config.persist(config.file, function(){});
    res.status(200).json(config.data.group);
  });
});
router.get('/:groupId', function(req, res, next){
  var group;
  config.searchGroupById(req.params.groupId, function(group){
    if(!group) {
      config.searchGroupByName(req.params.groupId, function (group) {
        if(!group){res.status(404).json({'status': 'group not found'});}
        else{res.json(group);}
      });
    }else{res.json(group);}
  });
});

router.post('/:groupId/color', function(req, res){
  try {
    var color = new Color(req.body);
    config.searchGroupByName(req.params.groupId, function(group){
      if(!group){
        config.searchGroupById(req.params.groupId, function(group){
          if(!group){res.status(404).json({'status': 'group not found'});}
          else{
            group.setColor(color);
            res.json(group);
          }
        });
      }else{
        group.setColor(color);
        res.json(group);
      }
    });
  }
  catch(err){
    res.status(501).json({'status': 'error: '+err});
  }
});
router.get('/:groupId/off', function(req, res){
  config.searchGroupById(req.params.groupId, function(group){
    if(!group){
      config.searchGroupByName(req.params.groupId, function(group){
        if(!group){res.status(404).json({'status': 'group not found'});}
        else{
          group.turnOff();
          res.json(group);
        }
      });
    }
    else{
      group.turnOff();
      res.json(group);
    }
  });
});
router.get('/:groupId/on', function(req, res){
  config.searchGroupById(req.params.groupId, function(group){
    if(!group){
      config.searchGroupByName(req.params.groupId, function(group){
        if(!group){res.status(404).json({'status': 'group not found'});}
        else{
          group.turnOn();
          res.json(group);
        }
      });
    }
    else{
      group.turnOn();
      res.json(group);
    }
  });
});router.get('/:groupId/toggle', function(req, res){
  config.searchGroupById(req.params.groupId, function(group){
    if(!group){
      config.searchGroupByName(req.params.groupId, function(group){
        if(!group){res.status(404).json({'status': 'group not found'});}
        else{
          group.toggle();
          res.json(group);
        }
      });
    }
    else{
      group.toggle();
      res.json(group);
    }
  });
});

module.exports = router;
