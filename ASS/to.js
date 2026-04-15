const fs = require('fs')
const { Writable } = require('stream')

let temp
try{
    temp=JSON.parse(process.argv[2])
    if(!Array.isArray(temp))
	return console.error('Template must be an array')
}
catch(err){
    return console.error(err.message)
}


const template=temp
const in_name=process.argv[3] 
const out_name=process.argv[4]

const rs=in_name!==undefined?fs.createReadStream(in_name):process.stdin
const ws=out_name!==undefined?fs.createWriteStream(out_name):process.stdout

ws.write(template.join(',')+'\n')

let prev_chunk=''

rs.pipe(new Writable({
    write(chunk, encoding, callback){
	// to be completed
    }
}))

