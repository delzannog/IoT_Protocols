var mqtt = require('mqtt')
var client  = mqtt.connect('ws://localhost:8000')


client.on('connect', function () {
  console.log('Connected')
  client.subscribe('mqtt/demo', function (err) {
    if (!err) {
      client.publish('mqtt/demo', 'first msg')
    }
    setInterval(function() {
      client.publish('mqtt/demo', 'next msg')
    }, 10);

  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('Received: '+message.toString())
})
