var mqtt = require('mqtt');
 
var settings = {
	port: 1883
};

var client = mqtt.connect('mqtt://test.mosquitto.org', settings);

// the client subscribe a new topic
client.subscribe('arduino/out');  

// fired when new message is received
client.on('message', function(topic, message) {
  console.log(msg);
});


