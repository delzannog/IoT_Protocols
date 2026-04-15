var mqtt = require('mqtt');
 
var settings = {
//        username : "druidlab",
//        password : "DRUIDfos_1",
        port: 1883
};



var client = mqtt.connect('mqtt://130.251.61.45', settings);
console.log(client)
//var client = mqtt.connect('mqtt://212.78.1.205', settings);

var x=0;

// Function Declaration

function random (min, max) {
    let randomInt = Math.floor(Math.random() * (max - min) + min);
    return randomInt;
}


function sendM() {
  x=random(50,60);
  msg=x.toString();
  console.log(msg);
  client.publish('M2MQTT_Unity/test',msg);
}

 
// the client subscribe a new topic
console.log(client.subscribe('M2MQTT_Unity/test'));
 
console.log('Client publishing...');
// the client publish a new message

x=0
setInterval(sendM,2000);
