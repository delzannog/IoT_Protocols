var mqtt = require('mqtt');

var count = 0;

var settings = {
//        username : "druidlab",
//        password : "DRUIDfos_1",
	port: 1883
};

var client = mqtt.connect('mqtt://127.0.0.1', settings);
//var client = mqtt.connect('mqtt://212.78.1.205', settings);

// the client subscribe some new topic
client.subscribe('M2MQTT_Unity/test');

console.log('Client started...');

// fired when new message is received
client.on('message', function(topic, message) {
  console.log(count + ': ' +message.toString());
  count++;
});

