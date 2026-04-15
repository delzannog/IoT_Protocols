const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');
var topic1 = "home/floor1/room1/temperature"
var topic11 = "home/floor1/room1/light"

var topic2 = "home/floor2/room1/temperature"
var topic21 = "home/floor2/room1/light"

var topicA = "home/alarms"

client.on('connect', () => {
  console.log('Connected');

  setInterval(() => {
    const value = Math.floor(Math.random() * 3) + 18;
    client.publish(topic1, value.toString());
    client.publish(topic11, "ON");
    console.log('Sent:', value);
  }, 2000); // every 2 seconds

  setInterval(() => {
    const value = Math.floor(Math.random() * 3) + 18;
    client.publish(topic2, value.toString());
    client.publish(topic21, "ON");
    console.log('Sent:', value);
  }, 2200); 


  setInterval(() => {
    const value = "Intrusion detected"; 
    client.publish(topicA, value);
    console.log('Sent:', value);
  }, 3000); 


});

