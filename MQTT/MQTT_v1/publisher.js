var mqtt = require('mqtt')
//var client  = mqtt.connect('mqtt://test.mosquitto.org')
var client  = mqtt.connect('mqtt://localhost:1883')

client.on('connect', function () {
  client.subscribe('device')
  client.subscribe('device/android/news')
  client.publish('device', 'Hello mqtt')
  client.publish('device/android/news', 'Hello android')
  client.publish('device/iphone/news', 'Hello iphone')
})

client.on('message', function (topic, message) {
  console.log(message.toString())
})

function messageToClient1() {
  client.publish('device/android/news', 'Hello android')
  //client.publish('device/iphone', 'Hello iphone')
}
function messageToClient2() {
  //client.publish('device/android', 'Hello android')
  client.publish('device/iphone/news', 'Hello iphone')
}

function messageToClient3() {
  //client.publish('device/android', 'Hello android')
  client.publish('device/wiko/news', 'Hello wiko')
}

setInterval(messageToClient1, 1000);
setInterval(messageToClient2, 1200);
setInterval(messageToClient3, 1400);
