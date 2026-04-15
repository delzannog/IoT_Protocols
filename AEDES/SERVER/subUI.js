const mqtt = require('mqtt');
const readline = require('readline');

const client = mqtt.connect('mqtt://localhost');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let currentTopic = null;

client.on('connect', () => {
  console.log('Connected');
  askTopic();
});

function askTopic() {
  rl.question('Insert topic: ', (topic) => {

    currentTopic = topic;

    client.subscribe(topic, () => {
      console.log('Waiting on', topic);
    });
  });
}

client.on('message', (topic, message) => {
  console.log("\n"+topic+" "+message.toString());
});
