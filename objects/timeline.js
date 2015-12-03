/**
 * Created by raphi on 02.12.2015.
 */
/**
 * Created by raphi on 02.12.2015.
 */
var Color = require('./color.js');
var Bulb = require('./bulb.js');
var Group = require('./group.js');
var client = require('../lifx.js');
function Timeline(id, time, device) {
    if(id.id && id.time && id.device){
        this.id = id.id;
        if(id.time instanceof Array){
            this.time = id.time;
        }
        if(id.device.power){
           if( id.device instanceof Bulb){
               this.device =id.device
           }else{
               this.device = new Bulb(id.device);
           }
        }else if (id.device.bulb){
            if(id.device instanceof Group){
                this.device = id.device
            }else{
                this.device = new Group(id.device);
            }
        }
        else{
           throw new Error('wrong formatted object');
        }


    }

    else
    {
        this.id = id;
        this.time = time;

        if(id.device.power){
            if( id.device instanceof Bulb){
                this.device =device
            }else{
                this.device = new Bulb(device);
            }
        }else if (id.device.bulb){
            if(id.device instanceof Group){
                this.device = device
            }else{
                this.device = new Group(device);
            }
        }
        else{
            throw new Error('no valid device');
        }
    }
}

Timeline.prototype.updatelights = function(color, err){
    //calculate color

    var light = client.light(this.id);
    light.color(color.hue, color.saturation, color.brightness, color.kelvin, color.duration);
};


module.exports = Timeline;