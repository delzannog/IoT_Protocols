var mqtt = require('mqtt');

const connectUrl = `mqtt://212.78.1.205`

const client = mqtt.connect(connectUrl, {
  clean: true,
  connectTimeout: 4000,
  username: 'studenti',
  password: 'studentiDRUIDLAB_1',
  port: 1883,
  reconnectPeriod: 1000,
})


// the client subscribe a new topic
client.subscribe('dibris');  

// fired when new message is received
client.on('message', function(topic, message) {
  msg=JSON.parse(message);
  console.log(msg);
});


