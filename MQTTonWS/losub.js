var mqtt = require('mqtt')
var client  = mqtt.connect('ws://localhost:8000')


client.on('connect', function () {
  console.log('Connected')
  client.subscribe('mytopic', function (err) {
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('Subscriber received: '+message.toString())
})
