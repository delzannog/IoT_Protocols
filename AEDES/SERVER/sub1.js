const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
  client.subscribe('home/floor1/room1/temperature');
  client.subscribe('home/alarms');
  client.subscribe('home/status');

});

client.on('message', (topic, message) => {
  console.log(topic, message.toString());
});
