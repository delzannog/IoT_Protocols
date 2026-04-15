const request = require('request');

request('https://www.dibris.unige.it').pipe(process.stdout);
