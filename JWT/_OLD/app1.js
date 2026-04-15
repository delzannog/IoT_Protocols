const restify = require('restify');
const request = require('request');

var server = restify.createServer();
server.listen(3000, () => {
   console.log('%s listening to %s', server.name, server.url);
});


var options = {
  url: 'localhost:3000',
  json: true,
  method: 'POST',
  Authorization: 'Bearer MYTKN',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/plain',
    'Api-Key': 'appkey'
  }
//  ,
/*  body: {
    'email':   'giancarlo.mascetti@gmail.com',
    'value':   '0.2',
    'userId':  'Gianky',
    'measureType': 'ECG'
  }
  */
};

var callback = (error, response, body) => {
  console.log(body);
  console.log(response.statusCode);
}

request(options, callback);