const BeaconScanner = require('node-beacon-scanner');
const scanner = new BeaconScanner();

var found = false;

function lookup(id) {
  if (found) return;
  if (id == "1f12a53db60c454baeefea0623d2ebf5") {
     found=true;
     console.log("Trovato beacon Giorgio");
     
   }
}

// Set an Event handler for becons
scanner.onadvertisement = (ad) => {
// console.log(JSON.stringify(ad, null, '  '));
  id=ad["id"];
  lookup(id);
};

// Start scanning
scanner.startScan().then(() => {
  console.log('Started to scan.')  ;
}).catch((error) => {
  console.error(error);
});
