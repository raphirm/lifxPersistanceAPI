/**
 * Created by raphi on 02.12.2015.
 */
var Color = require('./color.js');
var client = require('../lifx.js');
var config = require('../config.js');
function Bulb(id,  label, connected, power, color) {
    if(id.id && id.label && id.connected && id.power && id.color){
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
    var bulb = this;
    if(id.getState){
       id.getState(function(error, state) {
                bulb.id = state.id;

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

Bulb.prototype.setColor = function(color, err){
    if(color instanceof Color) {
        var light = client.light(this.id);
        light.color(color.hue, color.saturation, color.brightness, color.kelvin, color.duration);
    }else{
        throw new Error('color is not instance of Color Object')
    }
};


Bulb.prototype.update = function(){
    if(client.light) {
        var light = client.light(this.id);
        if (light) {
            light.getState(function (error, state) {
                id.getLabel(function (error, label) {
                    this.label = data;
                    this.connected = true;
                    this.power = state.power;
                    this.color = new Color(state.color.hue, state.color.saturation, state.color.brightness, state.color.kelvin);
                });
            });
        } else {
            this.connected = false;
        }
    }
};

module.exports = Bulb;