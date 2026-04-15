var request = require('request');

const URL='http://localhost:4000/samples'

const DATA={
    userId: "Gianky",
    date:   "2023-05-29",
    value:  "10",
    measureType: "ECG"
}


const HEADERS={
        "content-type": "application/json",  // <--Very important!!!
        "accept": "application/json", 
        "authorization": "Bearer TKN",
        "api-key": "apk161516"
     }

request.post(
    URL,
    { json: {
        name: "paul rudd",
        movies: ["I Love You Man", "Role Models"]
      } 
    },
 //   body: "ciao",
//    headers: HEADERS,
    function (error, response, body) {
        if (!error) {
            console.log(body);
        }
        else console.log("error");
      }
);
