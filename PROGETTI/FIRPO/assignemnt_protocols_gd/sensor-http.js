const http = require('http');

const HOSTNAME = "localhost"
const TIMEOUT = 2000 // ogni quanti millisecondi inviare dati
const roomsType = ["lecture-room", "bathroom", "library", "office"]
const names = ["aula-216", "aula-710", "aula-711", "aula-studio"]

const nodesDebug = {}

// creo 5 sensori a caso
for(let i = 0; i < 5; ++i) {
    // crea dati a caso della stanza dove si trova il nodo sensore
    let room = {
        name: names[Math.floor(Math.random() * names.length)],
        type: roomsType[Math.floor(Math.random() * roomsType.length)],
        floor: 2 + Math.floor(Math.random() * 4)
    }
    let data = JSON.stringify(room)

    let options = {
        hostname: HOSTNAME,
        port: 8080,
        path: '/registerNode',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    let registerReq = http.request(options, (res) => {
        let response = '';

        console.log('Status Code:', res.statusCode);

        res.on('data', (chunk) => {
            response += chunk;
        });

        res.on('end', () => {
            response = JSON.parse(response)
            console.log('Body: ', response);
            if( response.code === 42) {
                console.log("NODE ACCEPTED")
                nodesDebug[response.id] = room
                console.log("Private ID: " + response.id)
                console.log("name: " + room.name)
                console.log("floor: " + room.floor)
                console.log("type: " + room.type)

                console.log("Starting the temperature acquisition for: " + response.id)
                start(response.id)
            }
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });

    registerReq.write(data);
    registerReq.end();
}

// ogni tot secondi invio dei dati caso per ogni nodo creato
function start(id) {

    let dataTemp = JSON.stringify({id: id, temp: 16 + Math.floor(Math.random() * 15), time: Date.now()})

    const options = {
        hostname: HOSTNAME,
        port: 8080,
        path: '/pushNodeData',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': dataTemp.length
        }
    };

    const pushReq = http.request(options, (res) => {
        let response = '';
    
        console.log('Status Code:', res.statusCode);
    
        res.on('data', (chunk) => {
            response += chunk;
        });
    
        res.on('end', () => {
            response = JSON.parse(response)
            if( response.code === 42) {
                console.log(`${id} : ${nodesDebug[id].floor} : ${nodesDebug[id].type} : pushed data successfully!`)
                new Promise(r => setTimeout(r, TIMEOUT)).then(() => start(id));
            } else {
                console.log(`${id} : ERROR PUSHING : ${JSON.stringify(response)}`)
            }
        });
    
    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });

    pushReq.write(dataTemp);
    pushReq.end();  
}