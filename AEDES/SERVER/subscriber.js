var mqtt = require('mqtt');

var count = 0;

var settings = {
	port: 1883
};

var client = mqtt.connect('mqtt://127.0.0.1', settings);

// the client subscribe some new topic
client.subscribe('home/firstfloor/room1/sensor1');

console.log('Client started...');

// fired when new message is received
client.on('message', function(topic, message) {
  console.log(count + ': ' +message.toString());
  count++;
});

