// index.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/samples', (req, res) => {
    console.log('Got body:', req);
    res.sendStatus(200);
});

app.listen(4000, () => console.log(`Started server at 
http://localhost:4000!`));
