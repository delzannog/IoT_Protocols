var MQTT_CLIENT = new Paho.MQTT.Client("localhost", 8000, "client");

MQTT_CLIENT.connect({ onSuccess: myClientConnected });

function myButtonWasClicked() {
  var mqttMessage = new Paho.MQTT.Message("Hello");
  mqttMessage.destinationName = "mqtt/demo";
  MQTT_CLIENT.send(mqttMessage);
  console.log("Message sent!");
}


function myClientConnected() {
  console.log("Connected!");
  MQTT_CLIENT.subscribe("mqtt/demo");
}

function myMessageArrived(message) {
  var messageBody = message.payloadString;
  console.log(messageBody);
  var messageHTML = $("<p>"+messageBody+"</p>");
  $("#updateMe").prepend(messageHTML);
};

MQTT_CLIENT.onMessageArrived = myMessageArrived;


