var coap  = require('coap')
var req = coap.request('coap://localhost/request')

req.on('response', function(res) {
  res.pipe(process.stdout)
  res.on('end', function() {
      process.exit(0)
    })
  })

req.end()
