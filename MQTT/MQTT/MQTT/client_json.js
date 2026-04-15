var mqtt = require('mqtt');
 

var settings = {
	port: 1883
};

var client = mqtt.connect('mqtt://test.mosquitto.org', settings);

// the client subscribe a new topic
client.subscribe('dibris/indoor');  

// fired when new message is received
client.on('message', function(topic, message) {
  msg=JSON.parse(message);
  console.log(msg);
});

const json = {command:"forward",value:"20"};
jmsg = JSON.stringify(json);

function sendM(client) {
  client.publish('arduino/in',jmsg); 
  console.log('Command sent: '+jmsg);
}

//setInterval(sendM, 3000, client);


