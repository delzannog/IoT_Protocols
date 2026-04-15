var mqttHandler = require('./MqttHandler');

var mqttClient = new mqttHandler('ws://localhost:8080');
mqttClient.connect();

mqttClient.subscribe((process.argv[2] || 'library'))

