var request = require('request');

var options = {
  method: 'POST',
  body: {},
  json: true,
  url: 'http://localhost:4000/samples',
  headers: {
        "content-type": "application/json",  // <--Very important!!!
        "accept": "application/json",
        "authorization": "Bearer TKN",
        "api-key": "apk161516"
    },

};

function callback(error, response, body) {
  console.log("ciao");
   if (!error) {
    console.log(body)
  }
}


request(options, callback);
request(options, callback);
request(options, callback);
request(options, callback);

