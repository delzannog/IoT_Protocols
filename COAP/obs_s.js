// coap server that generates periodic updates
// clients must set obersvation mode

const coap    = require('coap')
    , server  = coap.createServer()

server.on('request', (req, res) => {

    var interval = setInterval(function () {
      console.log('New msg');
      res.write(new Date().toISOString() + '\n')
    }, 100)

    res.on('finish', function (err) {
      clearInterval(interval)
    })
  })

server.listen(() => {
  console.log('server started')
})
