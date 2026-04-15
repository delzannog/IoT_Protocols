const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost', {
  will: {
    topic: 'home/status',
    payload: 'CLIENT1 went OFFLINE',
    qos: 0,
    retain: true
  }
});

client.on('connect', () => {
  console.log('Connected');
  client.publish('home/alarms', 'ONLINE', { retain: true });
});


setInterval(() => {
  const payload = JSON.stringify({
    status: 'ONLINE',
    ts: Date.now()
  });

  client.publish('home/status', payload, {
    retain: true
  });

}, 2000);

setTimeout(() => {
  console.log('crash...');
  process.exit(1); // crash (NO client.end())
}, 10000);
