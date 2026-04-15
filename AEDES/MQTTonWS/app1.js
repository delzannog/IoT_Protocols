// Generate a new random MQTT client id on each page load
var MQTT_CLIENT_ID = "iot_web";


// Create a MQTT client instance
var MQTT_CLIENT = new Paho.MQTT.Client("iot.eclipse.org", 80, "/ws", 
MQTT_CLIENT_ID);


// Tell the client instance to connect to the MQTT broker
MQTT_CLIENT.connect({ onSuccess: myClientConnected });

// This is the function which handles button clicks

function myButtonWasClicked() {
  var mqttMessage = new Paho.MQTT.Message("Hello");
  // Set the topic it should be published to
  mqttMessage.destinationName = "mqtt/demo";
  // Publish the message
  MQTT_CLIENT.send(mqttMessage);
  console.log("Message sent!");
  // Select the tag with id="updateMe" and set its inner content
  $("#updateMe").text("Msg sent!");
}

// This is the function which handles subscribing to topics 

function myClientConnected() {
   MQTT_CLIENT.subscribe("mqtt/demo/");
}

// This is the function which handles received messages

function myMessageArrived(message) {
  // Get the payload
  var messageBody = message.payloadString;

  // Create a new HTML element wrapping the message payload
  var messageHTML = $("<p>"+messageBody+"</p>");

  // Insert it inside the ```id=updateMe``

  $("#updateMe").prepend(messageHTML);
};

// Tell MQTT_CLIENT to call myMessageArrived(message) each time a msg  arrives

MQTT_CLIENT.onMessageArrived = myMessageArrived;


