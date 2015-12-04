/**
 * Created by raphi on 02.12.2015.
 */
var Bulb = require('./bulb.js');
var Color = require('./color.js');
function Group(id, name, bulb) {
    var mybulb = this;
    if(id.id  != undefined && id.name  != undefined && id.bulb != undefined ){
        this.id = id.id;
        this.bulb = new Array();
        this.name = id.name;
        if (id.bulb.forEach) {
            var config = require('../config.js');
            id.bulb.forEach(function (b) {
                if (b instanceof Bulb) {
                    mybulb.bulb.push(b);
                } else {
                    if(b.id){
                        config.searchBulbById(b.id, function(bulb){
                            mybulb.bulb.push(bulb)
                        });
                    }else{
                        config.searchBulbById(b, function(bulb){
                            mybulb.bulb.push(bulb);
                        });
                    }
                }
            })
        }
        else{
            throw new TypeError('bulb parameter is not an array of bulbs')
        }
    }
    else
    {
        this.id = id;

        this.bulb = new Array();
        this.name = name;
        if (bulb.forEach) {
            var config = require('../config.js');
            bulb.forEach(function (b) {
                if (b instanceof Bulb) {
                    mybulb.bulb.push(b);
                } else {
                    if(b.id){
                        config.searchBulbById(b.id, function(bulb){
                            mybulb.bulb.push(bulb)
                        });
                    }else{
                        config.searchBulbById(b, function(bulb){
                            mybulb.bulb.push(bulb);
                        });
                    }
                }
            })
        }
        else{
            throw new TypeError('bulb parameter is not an array of bulbs')
        }
    }

}

Group.prototype.setColor = function(color){
    if(color instanceof Color){
        this.bulb.forEach(function(b){
            b.setColor(color);
            b.update();
        });
    }
    else{

    }

};
Group.prototype.turnOn = function(){
    this.bulb.forEach(function(b){
        b.turnOn();
    })
};
Group.prototype.turnOff = function(){
    this.bulb.forEach(function(b){
        b.turnOff();
    });
};
Group.prototype.toggle = function(){
    this.bulb.forEach(function(b){
        b.toggle();
    })
};

module.exports = Group;