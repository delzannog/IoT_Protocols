const http = require('http');

const HOSTNAME = "localhost"
const TIMEOUT = 2000 // ogni quanti millisecondi deve recuperare gli updates

const TYPE = (process.argv[2] || 'library')
var userID

// si iscrive ai nodi di tipo TYPE (attenzione che questo TYPE prima deve esistere nel server! quindi deve esserci almeno già un sensore!)
let subscribeReq = http.get(`http://${HOSTNAME}:8080/subscribeTo?type=${TYPE}`, (res) => {
    let response = '';

    console.log('Status Code:', res.statusCode);

    res.on('data', (chunk) => {
        response += chunk;
    });

    res.on('end', () => {
        response = JSON.parse(response)
        console.log('Body: ', response);
        if( response.code === 42) {
            console.log("USER SUBSCRIBED")
            userID = response.id

            console.log("Starting get updates for user: " + response.id)
            start()
        }
    });

}).on("error", (err) => {
    console.log("Error: ", err.message);
});

subscribeReq.end();


function start() {

    console.log(`To subscribe to other room types or floors run:\ncurl -X GET "http://${HOSTNAME}:8080/subscribeTo?id=${userID}&type=XXXX&floor=YYYY"`)
    let getUpdatesReq = http.get(`http://${HOSTNAME}:8080/getSubscriptionUpdates?id=${userID}`, (res) => {
        let response = '';
    
        console.log('Status Code:', res.statusCode);
    
        res.on('data', (chunk) => {
            response += chunk;
        });
    
        res.on('end', () => {
            response = JSON.parse(response)
            if( response.code === 42) {
                console.log(JSON.stringify(response))
                new Promise(r => setTimeout(r, TIMEOUT)).then(() => start());
            } else {
                console.log(`${userID} : ERROR : ${JSON.stringify(response)}`)
            }
        });
    
    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });

    getUpdatesReq.end();  
}