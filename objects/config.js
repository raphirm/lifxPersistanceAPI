/**
 * Created by raphi on 02.12.2015.
 */
var fs = require('fs');
var Bulb = require('./Bulb');
var Group = require('./Group');
var Timeline = require('./Timeline');
function Config(file) {
    this.file = file;
    this.data = JSON.parse(fs.readFileSync(file, 'utf8'));
    var bulb = new Array();
    if(this.data.bulb instanceof Array){
        this.data.bulb.foreach(function (b){
            bulb.push(new Bulb(b));
        });
    }

    this.data.bulb = bulb;
    var group = new Array();
    if(this.data.group instanceof Array){
        this.data.group.foreach(function(g){
           group.push(new Group(g));
        });
    }
    this.data.group = group;
    var timeline = new Array();
    if(this.data.timeline instanceof Array){
        this.data.timeline.foreach(function(t){
            timeline.push(new Timeline(t));
        })
    }
    this.data.timeline = timeline;
}

Config.prototype.persist = function(file){
    fs.writeFile('file', JSON.stringify(this.data), 'utf8', function(err){
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
    this.searchBulbById(bulb.id, function(bulb){
        if(!bulb){
            this.data.bulb.push(bulb);
        }
    });
};
Config.prototype.addGroup = function(group){
    this.searchGroupById(group.id, function(group){
        if(!group){
            this.data.group.push(group);
        }
    })
};


module.exports = Config;