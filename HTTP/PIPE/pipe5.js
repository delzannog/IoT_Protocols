const fs = require('fs');
const file = fs.createWriteStream('example.txt');
file.cork();
file.write('some ');
file.write('data ');
//process.nextTick(() => file.uncork());
