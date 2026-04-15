/* Server TCP */

var net = require('net');

var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');

/*
And connect with a tcp client from the command line using netcat, 
$ netcat 127.0.0.1 1337
> Echo server
*/

