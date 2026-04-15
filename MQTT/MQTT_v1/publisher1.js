var mqtt = require('mqtt')
//var client  = mqtt.connect('mqtt://test.mosquitto.org')
var client  = mqtt.connect('mqtt://localhost:1883')

client.on('connect', function () {
  client.subscribe('device')
  client.subscribe('device/android/news')
  client.publish('device', 'Hello mqtt')
  client.publish('device/android', 'Hello android')
  client.publish('device/iphone', 'Hello iphone')
})

client.on('message', function (topic, message) {
  console.log(message.toString())
})

var i=0;

function msgToClient1() {
	client.publish('device/android/news','android'+(i++),function(){});
}

function msgToClient2() {
	client.publish('device/iphone/news','iphone'+(i++),function(){});
}

function msgToClient3() {
	client.publish('device/wiko','wiko',function(){});
}

setInterval(msgToClient1, 1000);
setInterval(msgToClient2, 3000);
setInterval(msgToClient3, 5000);
