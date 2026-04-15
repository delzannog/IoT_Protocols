var http = require('http');


function SendRequest2(data) {
    function OnResponse(response) {
        var data = '';
        response.on('data', function(chunk) {
            data += chunk; 
        });
        response.on('end', function() {
            console.log("Risposta;",data);
            result=data; 
        });
    }

    rdata=JSON.parse(data);
    userId =rdata.userId; 
    accessToken =rdata.accessToken;

    params2 = {
      host: 'localhost', 
      port: 4000,
      path: '/samples',
      method: 'POST',
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "authorization": "Bearer "+accessToken,
        "api-key": "apk161516"
      }
    };

    setInterval(() => {
      data=JSON.stringify({
         date:   "2023:05:16",
         value:   Math.random(),
         userId:  userId,
         measureType: "ECG"
      });
     var request = http.request(params2, OnResponse); 
     request.write(data); 
     request.end();
    },1000);
}


var params1 = {
    host: 'localhost', 
    port: 4000,
    path: '/login',
    method: 'POST',
    headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "api-key": "apk161516"
    }
};


data=JSON.stringify({
        email:"t1_comftech@dibris.unige.it",
        password: "ciao"
});


function OnResponse(response) {
        var data = '';
        response.on('data', function(chunk) {
            data += chunk; 
        });
        response.on('end', function() {
            SendRequest2(data); 
        });
    }


var request = http.request(params1, OnResponse); 
request.write(data); 
request.end();




