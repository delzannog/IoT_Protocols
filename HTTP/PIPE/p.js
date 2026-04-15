const through2 = require('through2');
const Readable = require('readable-stream').Readable;

const stream = Readable({objectMode: true});   /* 1 */
stream._read = () => {};                       /* 2 */

setInterval(() => {                            /* 3 */
  stream.push({
    x: Math.random()
  });
}, 100);

const getX = through2.obj((data, enc, cb) => { /* 4 */
  cb(null, `${data.x.toString()}\n`);
});

stream.pipe(getX).pipe(process.stdout);        /* 5 */
