const through2 = require('through2');
const fs = require('fs');
const split = require('split2');

const parseCSV = () => {
    let templateKeys = [];
    let parseHeadline = true;

    return through2.obj((data, enc, cb) => {       
      if (parseHeadline) {
        templateKeys = data.toString().split(',');
        parseHeadline = false;
        return cb(null, null);                    
      }
  
      const entries = data.toString().split(',');
      const obj = {};
  
      templateKeys.forEach((el, index) => {      
        obj[el] = entries[index];
      });
  
      return cb(null, obj);                      
    });
  };
