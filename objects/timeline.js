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
    var timeline = this;
    var config = require('../config.js');
    if(id.id  != undefined && id.time  != undefined && id.device != undefined && id.color != undefined){
        this.id = id.id;
        if(id.time instanceof Array){
            this.time = id.time;
        }else{
            throw new Error('time value needs to be an array');
        }
        timeline.color = new Array();
        if(id.color instanceof Array){
            if(id.time.length == id.color.length){
                id.color.forEach(function(color){
                    if(color == 'now'){
                        timeline.color.push(color);
                    }else {
                        var color = new Color(color);
                        timeline.color.push(color);
                    }
                })
            }else{
                throw new Error('time and color arrays needs to be the size 2');
            }
        }else{
            throw new Error('color value needs to be an array');
        }
        config.searchBulbById(id.device, function(bulb){
            if(!bulb){
                config.searchBulbByLabel(id.device, function(bulb){
                    if(!bulb){
                        config.searchGroupById(id.device, function(group){
                            if(!group){
                                config.searchGroupByName(id.device, function(group){
                                    if(!group){

                                    }else{
                                        timeline.device = group.id;
                                        timeline.dtype = "group";
                                        if(timeline.color[0] == 'now'){
                                            timeline.color[0] == group.bulb[0].color;
                                        }

                                    }
                                });
                            }
                            else{
                                timeline.device = group.id;
                                timeline.dtype = "group";
                                if(timeline.color[0] == 'now'){
                                    timeline.color[0] == group.bulb[0].color;
                                }

                            }
                        });
                    }
                    else{
                        timeline.device = bulb.id;
                        timeline.dtype = "bulb";
                        if(timeline.color[0] == 'now'){
                            timeline.color[0] == bulb.color;
                        }
                    }
                });

            }
            else{
                timeline.device = bulb.id;
                timeline.dtype = "bulb";
                if(timeline.color[0] == 'now'){
                    timeline.color[0] == bulb.color;
                }
            }
        });


    }

    else
    {
        this.id = id;
        if(time instanceof Array){
            this.time = time;
        }else{
            throw new Error('time value needs to be an array');
        }
        timeline.color = new Array();
        if(color instanceof Array){
            if(time.length == color.length){
                color.forEach(function(color){
                    if(color == 'now'){
                        timeline.color.push(color);
                    }else {
                        var color = new Color(color);
                        timeline.color.push(color);
                    }
                })
            }else{
                throw new Error('time and color arrays needs to be the same size');
            }
        }else{
            throw new Error('color value needs to be an array');
        }
        var config = require('../config.js');
       config.searchBulbById(device, function(bulb){
           if(!bulb){
               config.searchBulbByLabel(device, function(bulb){
                 if(!bulb){
                     config.searchGroupById(device, function(group){
                         if(!group){
                             config.searchGroupByName(device, function(group){
                                 if(!group){
                                    throw new Error("no device found");
                                 }else{
                                     timeline.device = group.id;
                                     timeline.dtype = "group";
                                     if(timeline.color[0] == 'now'){
                                         timeline.color[0] == group.bulb[0].color;
                                     }

                                 }
                            });
                         }
                         else{
                             timeline.device = group.id;
                             timeline.dtype = "group";
                             if(timeline.color[0] == 'now'){
                                 timeline.color[0] == group.bulb[0].color;
                             }

                         }
                     });
                 }
                 else{
                     timeline.device = bulb.id;
                     timeline.dtype = "bulb";
                     if(timeline.color[0] == 'now'){
                         timeline.color[0] == bulb.color;
                     }
                 }
               });

           }
           else{
               timeline.device = bulb.id;
               timeline.dtype = "bulb";
               if(timeline.color[0] == 'now'){
                   timeline.color[0] == bulb.color;
               }
           }
       });

    }
    this.active = false;
}
function getNow() {
    return new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds()
}
function getBulbs(id, timeline){
    var config = require('../config.js');
    var bulbs = new Array();
    if(timeline.dtype == "bulb"){
        config.searchBulbById(id, function(b){
            bulbs.push(b);
        })
    }
    if(timeline.dtype == "group"){
        config.searchGroupById(id, function(g){
            g.bulb.forEach(function(b){
                bulbs.push(b);
            })
        })
    }

    return bulbs;
}
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function calculate(time, color){
    var b = {"time": time[0], "color": color[0]};
    var e = {"time": time[1], "color": color[1]};
    var interval = e.time - b.time;
    var now = getNow() - b.time;

    var kelvin = ((((e.color.kelvin - b.color.kelvin) / interval * now) + b.color.kelvin));
    if((typeof kelvin !== 'number' && kelvin !== undefined) || kelvin < 2500 || kelvin > 9000){
        kelvin = 3500;
    }
    var timeColor = new Color(Math.round((((e.color.hue - b.color.hue) / interval * now) + b.color.hue)),
        Math.round((((e.color.saturation - b.color.saturation) / interval * now) + b.color.saturation)),
            Math.round((((e.color.brightness - b.color.brightness) / interval * now) + b.color.brightness)),
                Math.round(kelvin));
    return timeColor;

}
function isSimilar(number1, number2){
    var un1 = Math.ceil(number1 + (0.2 * number1));
    var on1 = Math.floor(number1 - (0.2 * number1));
    if(un1 > number2 && on1 < number2){
        return true
    }else{
        return false
    }
}
Timeline.prototype.update = function(){

    var config = require('../config.js');
    //calculate color
    var timeline = this;
    //var light = client.light(this.id);
    //light.color(color.hue, color.saturation, color.brightness, color.kelvin, color.duration);
    if(timeline.time[0] < getNow() && timeline.time[1] > getNow()){
        var calc = calculate(this.time, this.color);
        //timeline applies now
        timeline.active = true;
        //calculate light
        if(timeline.prev){
            var stop = false;
            var prevlights = timeline.prev;
            getBulbs(timeline.device, timeline).forEach(function(b){
                var pl = timeline.prev[arrayObjectIndexOf(prevlights, b.id, 'id')];
                b.update();
                if(pl.offline == false) {
                    if (!(isSimilar(pl.color.hue,b.color.hue) && isSimilar(b.color.brightness,pl.color.brightness) && isSimilar(b.color.saturation, pl.color.saturation))) {
                        console.log("Color of "+ b.id+" not the same, stopping:"+JSON.stringify(pl.color)+" and "+ JSON.stringify(b.color));
                        stop = true;
                    }
                }



            });
            if(stop == true){
                console.log("different color, stop update")
            }else{
                console.log("same color, start update");
                getBulbs(timeline.device, timeline).forEach(function(b){
                    var pl = timeline.prev[arrayObjectIndexOf(prevlights, b.id, 'id')];
                    if(b.connected == false){
                        pl.offline = true;
                        console.log(b.id+" is offline, no update");
                    }
                    else{
                        pl.color = calc;
                        console.log(b.id+" will update to "+ calc+" now");
                        pl.offline=false;
                        calc.duration = 10000;
                        b.setColor(calc);
                    }
                });
            }
        }
        else{
            console.log("First iteration of timeline, creating new prev-Array");
                timeline.prev = new Array()
                getBulbs(timeline.device, timeline).forEach(function(b){
                    var pl = {"id": b.id};
                    if(b.connected == false){
                        console.log(b.id+" is offline, no update");

                        pl.offline = true;
                    }
                    else{
                        pl.color = calc;
                        console.log(b.id+" will update to "+ JSON.stringify(calc)+" now");
                        pl.offline = false;
                        calc.duration = 5000;
                        b.setColor(calc);
                    }
                    timeline.prev.push(pl);
                });
            }




    }else{
        //timeline does not apply anymore
        console.log("not in timeline, no updates");
        if(timeline.active == true){
            console.log("not in timeline and already ran, delete timeline");

            config.data.timeline.splice(config.data.timeline.indexOf(timeline), 1);

        }
    }
};



module.exports = Timeline;