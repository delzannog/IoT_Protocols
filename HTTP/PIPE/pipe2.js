const through2 = require('through2');

const toUpperCase = through2((data, enc, cb) => {      
  cb(null, Buffer.from(data.toString().toUpperCase())); 
});

process.stdin.pipe(toUpperCase).pipe(process.stdout);  
