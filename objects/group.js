/**
 * Created by raphi on 02.12.2015.
 */
var Bulb = require('./bulb.js');
var Color = require('./color.js');
function Group(id, name, bulb) {
    if(id.id && id.name && id.bulb){
        this.id = id.id;
        this.bulb = new Array();
        this.name = id.name;
        if (id.bulb.forEach()) {
            id.bulb.forEach(function (b) {
                if (b instanceof Bulb) {
                    this.bulb.push(b);
                } else {
                    this.bulb.push(new Bulb(b));
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
        if (bulb.forEach()) {
            bulb.forEach(function (b) {
                if (b instanceof Bulb) {
                    this.bulb.push(b);
                } else {
                    this.bulb.push(new Bulb(b));
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
        this.bulb.foreach(function(b){
            b.setColor(color);
            b.update();
        });
    }
    else{

    }

};
Group.prototype.powerOn = function(){
    this.bulb.foreach(function(b){
        b.power = 1;
        b.update();
    })
};
Group.prototype.powerOff = function(){
    this.bulb.foreach(function(b){
        b.power = 0;
        b.update();
    });
};
Group.prototype.powerToggle = function(){
    this.bulb.foreach(function(b){
        if(b.power == 1){
            b.power = 0;
        }
        else{
            b.power = 1;
        }
        b.update();
    })
}

module.exports = Group;