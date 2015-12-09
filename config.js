var fs = require('fs');
var fs = require('fs');
var Bulb = require('./objects/bulb.js');
var Group = require('./objects/group.js');
var Timeline = require('./objects/timeline.js');
var Flicker = require('./objects/flicker.js');
function Config(file) {
    this.file = file;
    this.data = JSON.parse(fs.readFileSync(file, 'utf8'));
    var bulb = new Array();
    if(this.data.bulb instanceof Array){
        this.data.bulb.forEach(function (b){
            bulb.push(new Bulb(b));
        });
    }

    this.data.bulb = bulb;


}

Config.prototype.persist = function(file, callback){
    fs.writeFile(file, JSON.stringify(this.data), 'utf8', function(err){
        if(err){
            callback(err)
        }else{
            callback()
        }
    });
};
Config.prototype.searchBulbByLabel = function(label, callback){
    var bulb = undefined;
    for (var i=0; i < this.data.bulb.length; i++) {
        if (this.data.bulb[i].label == label) {
            bulb = this.data.bulb[i];
        }
    }
    callback(bulb);

};
Config.prototype.searchBulbById = function(id, callback){
    var bulb = undefined;

    for (var i=0; i < this.data.bulb.length; i++) {
        if (this.data.bulb[i].id == id) {
            bulb = this.data.bulb[i];
        }
    }
    callback(bulb);
};
Config.prototype.searchGroupByName = function(name, callback){
    var group = undefined;
    for (var i=0; i < this.data.group.length; i++) {
        if (this.data.group[i].name == name) {
            group = this.data.group[i];
        }
    }
    callback(group);
};
Config.prototype.searchGroupById = function(id, callback){
    var group = undefined;
    for (var i=0; i < this.data.group.length; i++) {
        if (this.data.group[i].id == id) {
            group = this.data.group[i];
        }
    }
    callback(group);


};
Config.prototype.addBulb = function(bulb){

    var config = require('./config.js');

    var barr = config.data.bulb;
    config.searchBulbById(bulb.id, function(b){
        if(!b){
            barr.push(bulb);
            config.persist(config.file, function(err){
                if(!err){
                    console.log("config updated");

                }else{
                    throw new Error('Persistance failed:' + err);
                }
            });
        }
        else{
            b.connected = true;
            config.persist(config.file, function(err){
                if(!err){
                    console.log("config updated");

                }else{
                    throw new Error('Persistance failed:' + err);
                }
            });
        }
    });
};
Config.prototype.addGroup = function(group){
    var config = require('./config.js');
    var garr = config.data.group;
    config.searchGroupById(group.id, function(g){
        if(!g){
            garr.push(group);
            config.persist(config.file, function(err){
                if(!err){
                    console.log("config updated");

                }else{
                    throw new Error('Persistance failed:' + err);
                }
            });
        }
    })
};

Config.prototype.initTimeline = function(){
    var timeline = new Array();
    if(this.data.timeline instanceof Array){
        this.data.timeline.forEach(function(t){
            timeline.push(new Timeline(t));
        })
    }
    this.data.timeline = timeline;
    var group = new Array();
    if(this.data.group instanceof Array){
        this.data.group.forEach(function(g){
            group.push(new Group(g));
        });
    }
    this.data.group = group;
    var flicker = new Array();
    if(this.data.flicker instanceof Array){
        this.data.flicker.forEach(function(g){
            flicker.push(new Flicker(g));
        });
    }
    this.data.flicker = flicker;
}
var config = new Config('config');


module.exports = exports = config;
config.initTimeline();