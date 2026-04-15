'use strict'


const http = require('http')
const url  = require('url')
const mqttHandler = require('./MqttHandler');
const mosca = require('mosca')

const addNodes='/registerNode'
const getNodes='/getNodes'
const getNodeDatas='/getNodeDatas'
const pushNodeData='/pushNodeData'
const subscribeTo='/subscribeTo'
const getSubscriptionUpdates='/getSubscriptionUpdates'

const ERROR_CODE = 400
const HTTP_SUCCESS_CODE = 200

const APICODE_SUCCESS = 42
const APICODE_GENERIC_ERROR = 442
const APICODE_PARAMS_ERROR = 444

const res_headers_json = {"Content-Type" : "application/json"}
const res_headers_text = {"Content-Type" : "text/html; charset=UTF-8"}

var id_pairs = {}
var nodes = {}
var floors = {}
var types = {}
var users = {}
var topics = new Set()

//var mqttClient = new mqttHandler();
var mqttClient = new mqttHandler('ws://localhost:8080');


class TempData {
    /**
     * @constructs TempData
     * @param {Number} temp The temperature.
     * @param {Number} time The time when the temperature was taken.
     */

    constructor(temp, time) {
        this.temp = temp;
        this.time = time;
    }
}

class NodeSensor {
    /**
     * @constructs NodeSensor
     * @param {String} name The node name.
     * @param {String} zone The zone where the sersor is placed.
     * @param {Number} floor The floor where the sersor is placed.
     * @param {String} type The type of the area where the sersor is placed.
     */

    constructor(name, type, floor) {
        this.name = name;
        this.type = type;
        this.floor = floor;
        this.users = new Set(); // users subscribed to the events of this sensor
        this.datas = [];
    }
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

function generateRandomID() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

function checkIsPresent(x) {
    return (x !== undefined && x !== null)
}

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

function generateIDFor(structure) {
    let id
    do {
        id = generateRandomID();
    } while(id in structure)
    return id
}

async function publishToMqtt(nodeSensor, value) {
    let mex = JSON.stringify({
        "name" : nodeSensor.name,
        "type" : nodeSensor.type,
        "floor": nodeSensor.floor,
        "temp" : value.temp,
        "time" : value.time
    })
    mqttClient.sendMessage(nodeSensor.type, mex)
    mqttClient.sendMessage(nodeSensor.floor.toString(), mex)
}



async function pushToSubscribedUsers(publicNodeID, sensorNode, value) {
    let floor = sensorNode.floor
    let type = sensorNode.type

    // se il piano esiste
    if (floors[floor]) {
        console.log(`[pushToSubscribedUsers] floors[floor]: ${JSON.stringify(floors[floor])}  floors[floor].subscribed: ${JSON.stringify([...floors[floor].subscribed])}`)
        // per ogni utente iscritto aggiunge il nuovo valore al sensore corrispondente
        // se per quell'utente il sensore non esiste allora lo crea con il nuovo valore assegnato
        for ( let user of floors[floor].subscribed ) {
            console.log(`[pushToSubscribedUsers] pushing node: ${publicNodeID} to user: ${user} because floor: ${floor}`)
            users[user][publicNodeID] = value
        }
    }

    // come prima per i tipi di stanza
    if (types[type]) {
        console.log(`[pushToSubscribedUsers] types[type]: ${JSON.stringify(types[type])}  types[type].subscribed: ${JSON.stringify([...types[type].subscribed])}`)
        for ( let user of types[type].subscribed ) {
            console.log(`[pushToSubscribedUsers] pushing node: ${publicNodeID} to user: ${user} because type: ${type}`)
            users[user][publicNodeID] = value
        }
    }
}

/*
  Inserisce un valore ricevuto da un sensore all'interno della sua lista di dati e agli iscritti
*/
function pushNodeDataAction(data) {
    // check dei parametri
    if (!checkIsPresent(data) || data.id === undefined || id_pairs[data.id] === undefined || !checkIsPresent(data.temp) || !data.time )
        return JSON.stringify({code: APICODE_PARAMS_ERROR})
    
    // creao il nuovo valore da inserire nella lista
    let val = new TempData(data.temp, data.time)
    // recupero il nodo in cui inserire il valore
    let nodeSensor = nodes[id_pairs[data.id]]
    // inserisco il valore
    nodeSensor.datas.push(val)

    // aggiorno l'ultimo valore del nodo per gli iscritti
    pushToSubscribedUsers(id_pairs[data.id], nodeSensor, val)

    // bridge con mqtt
    publishToMqtt(nodeSensor, val)

    return JSON.stringify({code: APICODE_SUCCESS})
}

/*
  una volta iscritto ad un piano o un tipo di stanza uno user può ricevere
  gli update dei sensori di interesse in una maniera più veloce tramite questa chiamata
*/
function getSubscriptionUpdatesAction(getParams) {
    // check dei parametri
    if(isEmptyObject(getParams) || !checkIsPresent(getParams.id))
        return JSON.stringify({code: APICODE_PARAMS_ERROR})
    let userID = getParams.id

    // prende la lista dei sensori a cui l'utente è iscritto
    let sensorsSubscribed = users[userID]
    let res = {}

    console.log(`[getSubscriptionUpdatesAction] sensorsSubscribed: ${JSON.stringify(sensorsSubscribed)}`)

    // per ogni sensore ne prende i dati da restituire
    for ( let sensorID in sensorsSubscribed ) {
        if ( res[sensorID] === undefined ) {
            res[sensorID] = {}
            res[sensorID].data = sensorsSubscribed[sensorID]
            res[sensorID].name = nodes[sensorID].name
            res[sensorID].type = nodes[sensorID].type
            res[sensorID].floor = nodes[sensorID].floor
        }
    }

    return JSON.stringify({code: APICODE_SUCCESS, datas: res})
}

/*
  Permette ad uno user di ricevere informazioni solo dalle fonti che gli interessano tramite
  successive call a /getSubscriptionUpdates

  In pratica inserisce l'utente nel Set dei subscribed del floor e/o del type richiesto
*/
function subscribeAction(getParams) {
    // check dei parametri richiesti, almeno uno dei due tra floor e type dev'essere richiesto
    if (!checkIsPresent(getParams) || (!checkIsPresent(getParams.floor) && !checkIsPresent(getParams.type)))
        return JSON.stringify({code: APICODE_PARAMS_ERROR, listOfNodes: []})

    let userID
    let res = {}
    // in caso non venga fornito un ID (per identificare lo user) allora ne crea uno nuovo
    if ( ! getParams.id ) {
        userID = generateIDFor(users)
        users[userID] = {}
        res.id = userID
    } else {
        userID = getParams.id
        if (!(userID in users)) {
            // ERRORE: l'utente richiesto non esiste
            return JSON.stringify({code: APICODE_PARAMS_ERROR})
        }
    }

    // aggiungi l'utente nella lista degli iscritti del piano (se passato nei parametri)
    if(checkIsPresent(getParams.floor)) {
        /* a differenza di mqtt, lo iscrivo solo se il tipo di stanza esiste
           quindi non ti puoi iscrivere ad un piano se ancora non ci sono sensori registrati */
        if(getParams.floor in floors) {
            floors[getParams.floor].subscribed.add(userID)
            console.log(`user subscribed to floor: ${getParams.floor} - ${JSON.stringify([...floors[getParams.floor].subscribed])}`)
        }
    }
    
    // aggiungi l'utente nella lista degli iscritti del tipo di stanza (se passato nei parametri)
    if(checkIsPresent(getParams.type)) {
        /* a differenza di mqtt, lo iscrivo solo se il tipo di stanza esiste
           quindi non ti puoi iscrivere ad un tipo di stanza se ancora non ci sono sensori registrati */
        if(getParams.type in types) {
            types[getParams.type].subscribed.add(userID)
            console.log(`user: ${userID} - subscribed to type: ${getParams.type} - ${JSON.stringify([...types[getParams.type].subscribed])}`)
        }
    }

    res.code = APICODE_SUCCESS
    return JSON.stringify(res)
}

async function subscribeToMqttTopic(topic) {
    // questo serve 'if' per evitare la subscribe ogni volta
    if (!topics.has(topic)) {
        topics.add(topic)
        mqttClient.subscribe(topic)
    }
}

async function addThisNodeToUserSubscribed(public_GUID, newSensor) {
    let floor = newSensor.floor
    let type = newSensor.type

    // per ogni utente iscritto al tipo di stanza aggiunge il nodo nuovo alla sua mappa
    for ( let user of types[type].subscribed ) {
        users[user][public_GUID] = []
    }

     // per ogni utente iscritto al piano aggiunge il nodo nuovo alla sua mappa
    for ( let user of floors[floor].subscribed ) {
        users[user][public_GUID] = []
    }
}


/*
  Aggiunge un nuovo sensore nella mappa dei nodi (nodes) ed ai corrispondenti floor e type
  ritorna l'id privato con cui il sensore potrà caricare dati nel server
*/
function registerNodeAction(data) {
    // check dei parametri, sono tutti richiesti al momento della registrazione
    if (!data) return JSON.stringify({code: APICODE_PARAMS_ERROR})
    if (!checkIsPresent(data.floor) || !checkIsPresent(data.name) || !checkIsPresent(data.type)) return JSON.stringify({code: APICODE_PARAMS_ERROR})

    // genera un nuovo id privato che non esista già
    let private_GUID = generateIDFor(id_pairs)
    
    // genera un nuovo id pubblico che non esista già
    let public_GUID = generateIDFor(nodes)

    // associa l'id privato a quello pubblico
    id_pairs[private_GUID] = public_GUID

    // per ogni tipo di stanza (ed ogni piano) creao un insieme di sensori e di iscritti
    if (!(data.floor in floors)) floors[data.floor] = {publicNodeID: new Set(), subscribed: new Set()}
    if (!(data.type  in types))  types[data.type]   = {publicNodeID: new Set(), subscribed: new Set()}

    // creo l'oggetto per il nuovo sensore e lo aggiungo alle strutture
    let newSensor = new NodeSensor(data.name, data.type, data.floor)
    nodes[public_GUID] = newSensor
    floors[data.floor].publicNodeID.add(public_GUID)
    types[data.type].publicNodeID.add(public_GUID)

    console.log("New node added: PublicGUID: " + public_GUID + " - PrivateGUID: " + private_GUID + " - " + JSON.stringify(data))
    console.log(nodes)

    // aggiungo alla lista dei topics il piano ed il type
    subscribeToMqttTopic(data.floor.toString())
    subscribeToMqttTopic(data.type)

    // aggiunge il nodo agli iscritti del piano e del tipo di stanza del sensore aggiunto
    addThisNodeToUserSubscribed(public_GUID, newSensor)

    return JSON.stringify({code: APICODE_SUCCESS, id: private_GUID})
}

function getNodesIDListBy(ids, floor, type) {
    // se non è stato passato nulla crea una lista vuota
    let aux = (ids || [])
    // se è stato passato solo un id crea un Array con solo quel elemento, altrimenti significa che è già un Array
    if (!(ids instanceof Array)) aux = [ids]

    if ( checkIsPresent(floor) ) {
        // filtra per floor se presente
        aux = ( [...floors[floor].publicNodeID] || [] )
    } else {
        // altrimenti prende tutte i sensori di tutti i piani
        for (let i in floors)
            aux = aux.concat( ( [...floors[i].publicNodeID] || [] ) )
    }

    // filtra per type
    if (type)
        aux = aux.filter( x => types[type].publicNodeID.has(x) )
    
    return aux
}

function getNodeDatasAction(getParams) {
    console.log("getNodeDatasAction")

    // ritorna la lista dei publicID dei sensori filtrati per floor e type, se presenti
    let aux = getNodesIDListBy(getParams.id, getParams.floor, getParams.type)
    console.log(`[getNodeDatasAction] list of rooms found: ${JSON.stringify(aux)}`)

    let res = []
    for( let sensorPublicID of aux) {
        let tmp = {}
        tmp.id = sensorPublicID

        tmp.name = nodes[sensorPublicID].name
        tmp.floor = nodes[sensorPublicID].floor
        tmp.type = nodes[sensorPublicID].type

        console.log("[getNodeDatasAction] returning: " + JSON.stringify(tmp))

        tmp.datas = nodes[sensorPublicID].datas
        res.push(tmp)
    }

    return JSON.stringify({code: APICODE_SUCCESS, listOfNodes: res})
}


/*
  Ritorna la lista di tutti i sensori
  Se passato come parametro floor o type essi saranno filtrati di conseguenza
*/
function getNodesAction(getParams) {
    if (!checkIsPresent(getParams))
        return JSON.stringify({code: APICODE_PARAMS_ERROR, listOfNodes: []})

    // ritorna la lista dei publicID dei sensori filtrati per floor e type, se presenti
    let aux = getNodesIDListBy(getParams.id, getParams.floor, getParams.type)
    
    var l = []

    for (let sensorPublicID of aux) {
        let tmp = {}
        tmp.id = sensorPublicID
        tmp.name = nodes[sensorPublicID].name
        tmp.floor = nodes[sensorPublicID].floor
        tmp.type = nodes[sensorPublicID].type
        l.push(tmp)
    }

    return JSON.stringify({code:APICODE_SUCCESS, listOfNodes: l})
}

function manageIncomingRequest(req, res, type, action) {
    if (req.method !== type) {
        res.writeHead(ERROR_CODE, res_headers_text);
        res.end(`${JSON.stringify({ code : APICODE_GENERIC_ERROR, error:"This path accepts only GET requests"})}\n`);
    }

    switch(type) {
        case 'POST':
            let posted=''
            req.on('data', chunk => {
                //console.log(`Received ${chunk.length} bytes of data`)
                posted += chunk
            })
            req.on('end',() => {
                try {
                    res.writeHead(HTTP_SUCCESS_CODE,res_headers_text)
                    res.end(`${action(JSON.parse(posted))}\n`)
                } catch(err) {
                    res.writeHead(ERROR_CODE,res_headers_json)
                    res.end(`${JSON.stringify({ code : APICODE_GENERIC_ERROR, error:err.message })}\n`)
                }
            })
            break
        case 'GET':
            try{
                res.writeHead(HTTP_SUCCESS_CODE,res_headers_text)
                let getParams = url.parse(req.url,true).query
                console.log(`getParams: ${JSON.stringify(getParams)}`)
                res.end(`${action(getParams)}\n`)
            } catch(err){
                res.writeHead(ERROR_CODE,res_headers_json)
                res.end(`${JSON.stringify({ error:err.message })}\n`)
            }

    }
}

let s=http.createServer(
    (req,res) => {
        const urlObject = url.parse(req.url,true)
        const urlPath = urlObject.pathname

        console.log(`Request: ${req.method} URL: ${req.url}`)

        switch(urlPath) {
            case getNodes:
                manageIncomingRequest(req, res, 'GET', getNodesAction)
                break

            case addNodes:
                manageIncomingRequest(req, res, 'POST', registerNodeAction)
                break

            case getNodeDatas:
                manageIncomingRequest(req, res, 'GET', getNodeDatasAction)
                break

            case pushNodeData:
                manageIncomingRequest(req, res, 'POST', pushNodeDataAction)
                break

            case subscribeTo:
                manageIncomingRequest(req, res, 'GET', subscribeAction)
                break

            case getSubscriptionUpdates:
                manageIncomingRequest(req, res, 'GET', getSubscriptionUpdatesAction)
                break
            
            default:
                res.writeHead(ERROR_CODE,res_headers_json)
                res.end('endpoint inesistente')
        }
    })

const mqttServ = new mosca.Server({})
mqttServ.attachHttpServer(s)

s.listen(8080, () => mqttClient.connect())