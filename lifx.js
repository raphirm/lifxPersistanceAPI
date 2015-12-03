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
    light.getState(function(err, info) {
        if (err) {
            console.log(err);
        }
        console.log('Label: ' + info.label);
        console.log('Power:', (info.power === 1) ? 'on' : 'off');
        console.log('Color:', info.color, '\n');
    });
    new Bulb(light,config.addBulb());
});