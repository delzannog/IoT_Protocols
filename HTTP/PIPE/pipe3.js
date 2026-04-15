const through2 = require('through2');

const toUpperCase = through2((data, enc, cb) => {
  cb(null,  Buffer.from(data.toString().toUpperCase()));
});

const dashBetweenWords = through2((data, enc, cb) => {
  cb(null,  Buffer.from(data.toString().split(' ').join('-')));
});


process.stdin
  .pipe(toUpperCase)
  .pipe(dashBetweenWords)
  .pipe(process.stdout);
