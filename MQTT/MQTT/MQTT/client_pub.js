var mqtt = require('mqtt');
 
var settings = {
	port: 1883
};

var client = mqtt.connect('mqtt://test.mosquitto.org', settings);

function sendM(c) {
  c.publish('arduino/in',"forward"); 
  console.log('Command sent');
}

setInterval(sendM, 3000, client);


