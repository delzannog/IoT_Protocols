
var mqtt = require('mqtt');
 
var settings = {
	port: 1883
};

var client = mqtt.connect('mqtt://test.mosquitto.org', settings);

console.log("Connected");

// the client subscribe a new topic
client.subscribe('arduino/out');
client.subscribe('arduino/in');
  

// fired when new message is received
client.on('message', function(topic, message) {
  console.log('received: '+message);
});


