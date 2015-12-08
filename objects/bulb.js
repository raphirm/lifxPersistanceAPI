/**
 * Created by raphi on 02.12.2015.
 */
var Color = require('./color.js');
var client = require('../lifx.js');
var config = require('../config.js');
function Bulb(id,  label, connected, power, color) {
    if(id.id != undefined && id.label  != undefined && id.connected  != undefined && id.power  != undefined && id.color != undefined ){
        this.id = id.id;
        this.label = id.label;
        this.connected = id.connected;
        this.power = id.power;
        if(id.color instanceof Color){
            this.color = id.color;
        }
        else{
            this.color = new Color(id.color);
        }
        this.update();

    }
    else if(id.getState){
        var bulb = this;

        id.getState(function(error, state) {
                bulb.id = id.id;

               bulb.label = state.label;
               bulb.connected = true;
               bulb.power = state.power;
               bulb.color = new Color(state.color.hue, state.color.saturation, state.color.brightness, state.color.kelvin);
                label(bulb)
           });



    }
    else
    {
        this.id = id;
        this.label = label;
        this.connected = connected;
        this.power = power;
        this.color = color;
        if(color instanceof Color){
            this.color = color;
        }
        else{
            this.color = new Color(color);
        }
        this.update()
    }
}
Bulb.prototype.turnOff = function(){
    var client = require('../lifx.js');
    var light = client.light(this.id);
    if(light) {
        light.off();
        this.power = 0;
    }else{
        this.connected = false;
    }
    var config = require('../config.js');
    config.persist(config.file, function(err){});
};
Bulb.prototype.turnOn = function(){
    var client = require('../lifx.js');
    var light = client.light(this.id);
    if(light) {
        light.on();
        this.power = 1;
    }else{
        this.connected = false;
    }
    var config = require('../config.js');
    config.persist(config.file, function(err){});
};
Bulb.prototype.toggle = function(){
    var bulb = this;
    var client = require('../lifx.js');
    var light = client.light(this.id);
    if(light) {
    light.getState(function(error, state){
        if(state) {
            if (state.power == 1) {
                light.off();
                bulb.power = 0;
            } else {
                light.on();
                bulb.power = 1;
            }
            var config = require('../config.js');
            config.persist(config.file, function (err) {
            });
        }else{
            console.log("state not defined...");
        }
    });
        }else{
            bulb.connected = false;
        var config = require('../config.js');
        config.persist(config.file, function(err){});
        console.log("light not found...");
        }

}
Bulb.prototype.setColor = function(color, err){
    if(color instanceof Color) {
        var client = require('../lifx.js');
        var light = client.light(this.id);
        if(light) {
            light.color(color.hue, color.saturation, color.brightness, color.kelvin, color.duration);
        }
        else{
            this.connected = false;
        }
        this.color = color;
        var config = require('../config.js');
        config.persist(config.file, function(err){});
    }else{
        throw new Error('color is not instance of Color Object')
    }
};


Bulb.prototype.update = function(){
    var client = require('../lifx.js');
    var mybulb = this;
    if(client.light) {

        var light = client.light(mybulb.id);
        if (light) {
            light.getState(function (error, state) {
                    if(state){
                        mybulb.label = state.label;
                        mybulb.connected = true;
                        mybulb.power = state.power;
                        mybulb.color = new Color(state.color.hue, state.color.saturation, state.color.brightness, state.color.kelvin);
                    }else{
                        console.log(new Date().toString()+": No state received for bulb "+mybulb.id+" error: "+error)
                    }


            });
        } else {
            this.connected = false;
        }
    }
};

module.exports = Bulb;