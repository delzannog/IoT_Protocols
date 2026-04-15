var coap        = require('coap')
  , server      = coap.createServer()

server.on('request', function(req, res) {
  res.end('Request: '+req.url+ req.url.split('/')[1] + '\n')
})


// the default CoAP port is 5683
server.listen(function() {})
