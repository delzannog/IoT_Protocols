const http = require("http");

const url = 'http://localhost:4000';


const data = {
    "userId": "Gianky",
    "date":   "2023-05-29",
    "value":  "10",
    "measureType": "ECG"
}


const options = {
  method: 'POST',
  json: true,
  'Accept': 'application/json',
  'Authorization': 'Bearer {token}',
  'Content-Type': 'application/json',
  'Api-Key': 'apikey'
};


let result = '';

const req = http.request(url, options, (res) => {
    console.log(res.statusCode);
});

req.write(data);
req.end();

