http-server-extend.js
crea il server, espone l'API http alla porta 8080
volendo ance quella mqtt on websocket sempre alla 8080, ma per pubblicare è farlo tramite l'API http


sensor-http.js
crea 5 sensori con dati a caso ed ogni due secondi invia dati a caso all'API http


http-subscriber.js
DA LANCIARE DOPO AVER CRETO QUALCHE SENSORE
un esempio di codice che sfrutta l'iscrizione tramite l'API http ed ogni 2 secondi fa polling
per ricevere updates a cio che si è iscritto
di default si iscrive a 'library', ma si può decidere il topic anche passandolo come primo
argomento da linea di comando


mqtt-server.js
volendo crea un server mqtt sulla porta 1883, facendo connettere il server ad esso i dati
verranno pubblicati su di esso


mqtt-subscriber.js
un semplice esempio di come un client possa iscriversi al server mqtt, di default si iscrive a
'library' ma tramite linea di comando può essere deciso il topic