const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://test.mosquitto.org');
//const client = mqtt.connect('mqtt://mqtt.eclipseprojects.io');
//const client = mqtt.connect('https://aedes.physiometrics.online',443);


client.on('connect', () => {
  console.log('Connected')
  client.subscribe('gdlz/gdash', () => {
    console.log(`Subscribe to topic gdash/user1`)
  })
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})
