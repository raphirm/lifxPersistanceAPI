var LifxClient = require('node-lifx').Client;
var client = new LifxClient();
var config = require('./config.js');
var Bulb = require('./objects/bulb.js');
var Color= require('./objects/color.js');
var INTERVAL = 200;

function loop(data, callback){
    var flickering = false;
    //config.status=='started'
    var count = 0;
    var timer = setInterval(function () {
        if ((count % 15) != 0 && (count % 14) != 0 && (count % 16) != 0){
            flicker(flickering)
        }
        if ((count % 15) == 0 && flickering == false) {

            //update color info regularily, if some other application did change settings
            console.log(new Date().toString() + ": interval started, getting stats from all lights")
            var lights = client.lights();

            if (lights instanceof Array) {
                lights.forEach(function (light) {
                    config.searchBulbById(light.id, function (bulb) {
                        if (bulb) {
                            bulb.update()
                        } else {
                            console.log(light.id + "is not registred in application");
                        }
                    });

                });
            }
        }

        //if there is a timeline, start it now!
        //tbd
        if ((count % 300) == 0){
            if (config.data.timeline.length > 0) {

                config.data.timeline.forEach(function (timeline) {
                    console.log("applying timline " + timeline.id);
                    timeline.update();
                    config.persist(config.file, function(){});

                });
            }
            count = 1;

        }
        count = count + 1;

    }, INTERVAL);

}

function flicker(flickering){
    var destiny = Math.random()*100;
    if(destiny<80 && flickering == false){
        flickering = true;
        //flicker
        if(config.data.flicker){
            config.data.flicker.forEach(function(flicker){
                var bulb = flicker.bulb;
                var color = bulb.color;

                var originalb = color.brightness;
                var maxDelta = originalb * flicker.strength / 100;
                var strength = Math.ceil(Math.random()*maxDelta);
                color.brightness = originalb - strength;
                color.time = 90;
                bulb.setColor(color);
                console.log("Flicker to "+color.brightness)
                setTimeout(function(){
                    color.brightness = originalb;
                    color.time = 0;
                    bulb.setColor(color);
                    console.log("Flick back to  to "+color.brightness)
                    setTimeout(function(){
                        flickering = false
                    }, 200);
                }, 100)

            })
        }
    }
}
client.on('listening', function() {
  var address = client.address();
  console.log(
      'Started LIFX listening on ' +
      address.address + ':' + address.port + '\n'
  );
});
client.init();
client.startDiscovery();
module.exports = client;
//on event definitions

client.on('light-new', function(light) {
    console.log('New light found.');
    console.log('ID: ' + light.id);
    console.log('IP: ' + light.address + ':' + light.port);
    config.searchBulbById(light.id, function(bulb){
        if(bulb){
            bulb.setColor(bulb.color);
        }else {
            light.getState(function (err, info) {
                if (err) {
                    console.log(err);
                }
                console.log('Label: ' + info.label);
                console.log('Power:', (info.power === 1) ? 'on' : 'off');
                console.log('Color:', info.color, '\n');

            });
        }
    });

    new Bulb(light,config.addBulb);
});
client.on('light-online', function(light) {
   config.searchBulbById(light.id, function(bulb){
       bulb.setColor(bulb.color);
   });

    console.log('Light back online. ID:' + light.id + ', IP:' + light.address + ':' + light.port + '\n');
});

client.on('light-offline', function(light) {
    config.searchBulbById(light.id, function(bulb){
        bulb.connected = false;

    });
    console.log('Light offline. ID:' + light.id + ', IP:' + light.address + ':' + light.port + '\n');
});

loop();