var mqtt = require('mqtt')
var client  = mqtt.connect('ws://localhost:8000')


client.on('connect', function () {
  console.log('Connected')
  client.subscribe('mytopic', function (err) {
    if (!err) {
      client.publish('mytopic', 'publishing on my topic')
    }
    setInterval(function() {
      client.publish('mytopic', 'publishing on my topic')
    }, 5000);

  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('Received: '+message.toString())
})
