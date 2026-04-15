const fs=require('fs')
const SIZE=2048
const buffer=Buffer.allocUnsafe(SIZE)

let open=promisify(fs.open)
let read=promisify(fs.read)
let close=promisify(fs.close)
let infd

open(process.argv[2]||'in.txt').then
(fd=>{infd=fd;return read(infd,buffer,0,SIZE,null)}).then
(res=>console.log(res[1].toString('utf8',0,res[0]))).then
(()=>close(infd)).then
(()=>console.log('closed'),err=>console.error(err.message))
    
function promisify(inf){
    return (...args) => {
        return new Promise((resolve, reject) =>  {
            function customCallback(err, ...results) {
                if (err) {
                    reject(err)
                } else {
                    resolve(results.length === 1 ? results[0] : results)
                }
            }
            args.push(customCallback)
            inf.call(this, ...args)
        })
    }
}

