var request = require('request');

request.post(
    //First parameter API to make post request
    'http://localhost:4000/samples',

    //Second parameter DATA which has to be sent to API
    { json: {
        name: "paul rudd",
        movies: ["I Love You Man", "Role Models"]
      } 
    },
    
    //Thrid parameter Callack function  
    function (error, response, body) {
        if (!error && response.statusCode == 201) {
            console.log(body);
        }
    }
);
