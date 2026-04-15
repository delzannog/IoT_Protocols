const fetch = require('node-fetch');


const body = {a: 1};

const response = await fetch('http://localhost:4000/samples', {
	method: 'post',
	body: JSON.stringify(body),
	headers: {'Content-Type': 'application/json'}
});
const data = await response.json();

console.log(data);
