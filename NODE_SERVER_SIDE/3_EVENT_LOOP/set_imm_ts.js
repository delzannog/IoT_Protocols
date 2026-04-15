
function timeout() {
  console.log('TIMEOUT FIRED');
}

var i=0;

function compute(){
  for (j=0;j<4;j++) console.log(i++);
}

function batch(k){
  if (k>0)
  { compute();
    setImmediate(() => batch(k-1))
  }
}

setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 0)

setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 6)

setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 20)

batch(3)
