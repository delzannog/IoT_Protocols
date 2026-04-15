var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
//var client  = mqtt.connect('mqtt://localhost:1883')

client.on('connect', function () {
  client.subscribe('gdelzanno')
})

client.on('message', function (topic, message) {
  console.log(message.toString())
})
