var mqtt = require('mqtt');
 
const json = {command:"forward",value:"20"};
jmsg = JSON.stringify(json);

var settings = {
	port: 1883
};

var client = mqtt.connect('mqtt://test.mosquitto.org', settings);


// the client subscribe a new topic
client.subscribe('arduino/out');  

// fired when new message is received
client.on('message', function(topic, message) {
  msg=JSON.parse(message);
  console.log(msg);
});

function sendM(c) {
  c.publish('arduino/in',jmsg); 
  console.log('Command sent: '+jmsg);
}

//setInterval(sendM, 3000, client);


