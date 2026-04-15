const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://test.mosquitto.org');
//const client = mqtt.connect('mqtt://mqtt.eclipseprojects.io');
//const client = mqtt.connect('https://aedes.physiometrics.online',443);

app.use('/login', express.json({ limit: 100 }))
app.use('/samples', express.json({ limit: 100 }))

app.get('/api',(req,res)=>{
    res.json({
        "message":"Hello",
    });

});

app.post('/samples',(req,res)=>{
    btoken=req.headers.authorization;
    accessToken =btoken.substring(7,btoken.length);
    apikey=req.headers['api-key'],
    bd=req.body;  
    const data = {
        date:    bd.date,
        value:   bd.value,
        userId:  bd.userId,
        measureType: bd.measureType
    };
    jdata=JSON.stringify(data);
    console.log("\n\nAccessToken: "+accessToken);
    console.log("Api-Key: "+apikey);
    console.log("Data:");
    console.log(data);
    res.json({
        "message":"OK",
    });
    if (client.connected === true) {
        client.publish('gdlz/gdash',jdata);
    }
    else console.log('error');
});


app.post('/login',(req,res)=>{
    apikey=req.headers['api-key'],
    console.log('Body Request:', req.body);
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    if (user.email == "t1_comftech@dibris.unige.it") {
      userName="Giancarlo Mascetti"
      userId="Gianky"
      jwt.sign({user:userId},'secretkey',(err,token)=>{
         res.json({
            "accessToken":token,
            "userName":userName,
            "userId":userId
         });
       });
    }

});

app.listen(4000,(req,res)=>{
    console.log('Avvio del server sulla porta 4000\n\n');
});
