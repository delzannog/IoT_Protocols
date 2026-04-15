const http = require('http');

const server = http.createServer((req, res) => {
  // `req` is an http.IncomingMessage, which is a readable stream.
  // `res` is an http.ServerResponse, which is a writable stream.

  let body = '';
  // Get the data as utf8 strings.
  // If an encoding is not set, Buffer objects will be received.
  req.setEncoding('utf8');

  req.on('readable', function() {
  // There is some data to read now.
  let data;
  while ((data = this.read()) !== null) {
    console.log(data);
  }
  });

  // The 'end' event indicates that the entire body has been received.
  req.on('end', () => {
    try {
      res.write("OK");
      res.end();
    } catch (er) {
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token o in JSON at position 1

// $ curl localhost:1337 -d '{"first_name":"bob", "age":30}'
// object
// $ curl localhost:1337 -d '@data.txt'
// object
