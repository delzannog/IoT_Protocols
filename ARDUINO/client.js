var mqtt = require('mqtt');
 
var settings = {
	port: 1883
};

var client = mqtt.connect('mqtt://127.0.0.1', settings);
 
// the client subscribe a new topic
client.subscribe('presence');
 
console.log('Client publishing...');
// the client publish a new message
client.publish('presence', 'Client 1 is alive.. Test Ping! ' + Date());

// fired when new message is received
client.on('message', function(topic, message) {
  console.log(message.toString());
});