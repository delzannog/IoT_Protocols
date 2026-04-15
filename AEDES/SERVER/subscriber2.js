var mqtt = require('mqtt');

var count = 0;

var settings = {
	port: 1883
};

var client = mqtt.connect('mqtt://127.0.0.1', settings);

// home/firstfloor/room1/temperature
// home/firstfloor/room2/temperature
// home/firstfloor/+/temperature
// home/firstfloor/#

client.subscribe('home/firstfloor/room1/temperature');


console.log('Client started...');

// fired when new message is received
client.on('message', function(topic, message) {
  console.log(count + ': ' +message.toString());
  count++;
});

