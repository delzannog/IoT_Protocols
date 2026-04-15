import json
from urllib import request, parse

data = {"name": "Obi-Wan Kenobi"}

encoded_data = json.dumps(data).encode()

req = request.Request('http://localhost:4000', data=encoded_data)
req.add_header('Content-Type', 'application/json')
response = request.urlopen(req)

text = response.read()

print(json.loads(text.decode('utf-8')))

