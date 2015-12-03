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
function Timeline(id, time, color, device) {
    if(id.id  != undefined && id.time  != undefined && id.device != undefined && id.color != undefined){
        this.id = id.id;
        if(id.time instanceof Array){
            this.time = id.time;
        }else{
            throw new Error('time value needs to be an array');
        }
        if(id.color instanceof Array){
            if(id.time.length == id.color.length){
                this.color = id.color;
            }else{
                throw new Error('time and color arrays needs to be the same size');
            }
        }else{
            throw new Error('color value needs to be an array');
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
        if(time instanceof Array){
            this.time = time;
        }else{
            throw new Error('time value needs to be an array');
        }
        if(color instanceof Array){
            if(time.length == color.length){
                this.color = color;
            }else{
                throw new Error('time and color arrays needs to be the same size');
            }
        }else{
            throw new Error('color value needs to be an array');
        }
        var config = require('../config.js');
       config.searchBulbById(device, function(bulb){
           if(!bulb){
               config.searchBulbByLabel(device)
           }
       });

    }
}

Timeline.prototype.updatelights = function(color, err){
    //calculate color

    var light = client.light(this.id);
    light.color(color.hue, color.saturation, color.brightness, color.kelvin, color.duration);
};


module.exports = Timeline;