const through2 = require('through2');
const fs = require('fs');
const split = require('split2');

const parseCSV = () => {
    let templateKeys = [];
    let parseHeadline = true;

    return through2.obj((data, enc, cb) => {       /* 1 */
      if (parseHeadline) {
        templateKeys = data.toString().split(',');
        parseHeadline = false;
        return cb(null, null);                     /* 2 */
      }
  
      const entries = data.toString().split(',');
      const obj = {};
  
      templateKeys.forEach((el, index) => {       /* 3 */
        obj[el] = entries[index];
      });
  
      return cb(null, obj);                       /* 4 */
    });
  };

List=[];

const getX = through2.obj((data, enc, cb) => { /* 4 */
  cb(null, `${data.nome.toString()} ${data.dd.toString()} \n`);
});  

const addD = through2.obj((data, enc, cb) => { 
  data["dd"]="oggi"
  cb(null, data);
});


const stream = fs.createReadStream('a.csv');

stream
  .pipe(split())
  .pipe(parseCSV())
  .pipe(addD)
  .pipe(buildL)
  .pipe(getX)
  .pipe(process.stdout);

console.log("ciao",List);

  
