const headers = { 'Authorization': 'Bearer my-token' }; 
fetch('http://localhost:4000/samples', { headers })
    .then(response => console.log(response));
