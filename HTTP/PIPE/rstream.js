const Readable = require('stream').Readable
//const  { Readable }   = require('stream')

const createReadStream = () => {
  const data = ['1000','2000', '3000', '4000', '5000']
  return new Readable({
    //encoding: 'utf8',
    objectMode: true,
    read () {
      if (data.length === 0) this.push(null)
      else this.push(data.shift()) 
      //shift removes and returns first element
    }
  })
}
const rs = createReadStream()
rs.on('data', data => { 
  console.log('Data chunk:\n', data)
})
rs.on('end', () => {
  console.log('Read is finished!')
})

