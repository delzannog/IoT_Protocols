var fs = require("fs");

function foo1() {
    console.log('Timer');
}

function foo2(err,data) {
  	if (err) return console.error(err);
    console.log('ReadFile');
}

function foo3() {
    console.log('SetImmediate');		
}

function foo4() {
    console.log('NextTick');		
}

setTimeout(foo1,0);
fs.readFile('input.txt', foo2);
setImmediate(foo3);
process.nextTick(foo4);
setImmediate(foo3);


