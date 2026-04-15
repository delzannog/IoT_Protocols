import requests

headers = {
 'content-type': 'application/json',
 'accept':'application/json',
 'authorization': 'Bearer xxx',
 'api-key': 'apk161516'
}

data = {'date' : 'xxx', 'value':'10', 'userId':'GG', 'measureType':'ECG'}

url = 'http://localhost:4000'
response = requests.post(url,headers=headers)
print(response)
print(response.json())
