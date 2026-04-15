var cluster = require('cluster');
var found = false;
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosquitto.org');
client.subscribe('gdelzanno');

function lookup(worker,id) {
  console.log("Found: "+id);
  if (found) return;
  if (id == "c0a6ead1f26ee19b196184a415bcc058") {     found=true;
     worker.send(0);
     client.publish('gdelzanno','Beacon Found!');
     console.log("Trovato beacon Giorgio");
   }
}

if(cluster.isMaster) {
    cluster.fork();

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
        const BeaconScanner = require('node-beacon-scanner');
        const scanner = new BeaconScanner();

        scanner.onadvertisement = (ad) => {
          id=ad["id"]; 
          console.log(id);
          lookup(worker,id);
        };

        scanner.startScan().then(() => {
         console.log('Started to scan.')  ;
        }).catch((error) => {
         console.error(error);
        });
    });

} else if (cluster.isWorker) {
    const express = require('express');
    const app = require('express')();
    const bodyParser = require('body-parser');
    var found = false;

    app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(8080, () => {
      console.log('listening on 8080');
    });

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    app.post('/scan', (req, res) => {
      if (found) {
        //res.sendFile(__dirname + '/beacon.html');
        res.redirect("http://www.unige.it")
      }
      else {
        res.sendFile(__dirname + '/index.html');
      }
    });

    process.on('message', (msg) => {
      found = true;
    });

}
