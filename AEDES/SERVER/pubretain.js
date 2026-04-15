const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
  const value = 'Alarm is off';

  client.publish('home/alarms', value, { retain: true });

  console.log('Retained message sent:', value);

  client.end();
});
