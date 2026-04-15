

const express = require('express');
const app = require('express')();
const bodyParser = require('body-parser');
const BeaconScanner = require('node-beacon-scanner');
const scanner = new BeaconScanner();

var found = false;

function lookup(id) {
  if (found) return;
  if (id == "c0a6ead1f26ee19b196184a415bcc058") {
     found=true;
     console.log("Trovato beacon Giorgio");
   }
}

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, () => {
  console.log('listening on 8080');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/scan', (req, res) => {
  if (found) {
    res.sendFile(__dirname + '/beacon.html');
  }
  else {
    res.sendFile(__dirname + '/index.html');
  }
});

scanner.onadvertisement = (ad) => {
  id=ad["id"];
  console.log(id);
  lookup(id);
};

scanner.startScan().then(() => {
 console.log('Started to scan.')  ;
}).catch((error) => {
 console.error(error);
});

