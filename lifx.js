var LifxClient = require('node-lifx').Client;
var client = new LifxClient();
var config = require('./config.js');
var Bulb = require('./objects/bulb.js');
var Color= require('./objects/color.js');
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
