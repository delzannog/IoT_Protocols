var mosca = require('mosca');

var settings = {
  port: 1883
};

// here we start mosca
var server = new mosca.Server(settings);
// fired when the mqtt server is ready
server.on('ready', function() {
  console.log(Date() + ' Mosca server is up and running');
});

// fired when a client is connected
server.on('clientConnected', function(client) {
  console.log('Client Connected: ', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published : ', packet.payload.toString());
});

// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
  console.log('Subscribed : ', topic, " from : ", client.id);
});

// fired when a client unsubscribes to a topic
server.on('unsubscribed', function(topic, client) {
  console.log('Unsubscribed : ', topic, " from : ", client.id);
});

// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
  console.log('Client Disconnected : ', client.id);
});

/////////////////////////////////////////////////////
// create a new message
var message = {
  topic: 'presence',
  payload: "Test Pong!",
  qos: 2,
  retain: true
};

function messageToClient() {
	// the server publish new message
	server.publish(message, function() {
	  console.log('message send to Clients');
	});
}

// the server sends the message every 2.5 seconds
setInterval(messageToClient, 1000);
/////////////////////////////////////////////////////
