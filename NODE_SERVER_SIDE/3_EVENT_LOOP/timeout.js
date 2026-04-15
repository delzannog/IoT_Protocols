setTimeout(function A() {
  setTimeout(function B() {
    console.log(1);
    setTimeout(function D() { console.log(2); });
    setTimeout(function E() { console.log(3); });
  });
  setTimeout(function C() {
    console.log(4);
    setTimeout(function F() { console.log(5); });
    setTimeout(function G() { console.log(6); });
  });
});

setTimeout(function timeout() {
  console.log('TIMEOUT FIRED');
}, 0)
