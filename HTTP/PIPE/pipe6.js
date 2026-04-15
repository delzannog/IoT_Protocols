var through2 = require('through2')

var objectStream = through2.obj(function(chunk, encoding, callback) {
    chunk.timestamp = new Date()
    this.push(chunk)
    callback()
})

objectStream.pipe(process.stdout)
objectStream.write({ status: 404, message: 'Not found' })
objectStream.write({ status: 500, message: 'Internal server error'})

