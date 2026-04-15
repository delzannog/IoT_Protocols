var mqtt = require('mqtt');
 
var settings = {
	port: 1883
};

var client = mqtt.connect('mqtt://130.251.61.45', settings);
 
// the client subscribe a new topic
client.subscribe('presence');
 
console.log('Client publishing...');
// the client publish a new message
client.publish('dibris', 'Client 1 is alive.. Test Ping! ' + Date());

// fired when new message is received
client.on('message', function(topic, message) {
  console.log("ok");
 // console.log(message.toString());
});
