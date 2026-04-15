var events = require('events');
var eventEmitter = new events.EventEmitter();

var msg = function msg() {
    console.log('ciao');
};

var list1 = function list1() {
    process.nextTick(msg);
    msg();
};


eventEmitter.on('evt1', list1);
eventEmitter.emit('evt1');

while (true);
console.log("Ciao");
