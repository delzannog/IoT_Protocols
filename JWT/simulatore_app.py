import requests
import json
import time
import random
 
url = "http://localhost:5000/login"
data = {'email':'t1_comftech@dibris.unige.it','password': 'ciao'}
headers = {'content-type': 'application/json', 'api-key': 'bbbBBB'}

r=requests.post(url, data=json.dumps(data), headers=headers)
r1=json.loads(r.text)
token=r1['accessToken']
user =r1['userId']

url = "http://localhost:5000/samples"
headers = {'content-type': 'application/json', 'authorization': 'Bearer '+token, 'api-key': 'bbbBBB'}

i=1
while True:
  print("Step: ",i)
  i=i+1
  data = {'date': 123456789, 'value': random.randint(10,20), 'userId': 
user, 'measureType': "ECG"}
  r = requests.post(url, data=json.dumps(data), headers=headers)
  r1=json.loads(r.text)
  msg=r1['message']
  print(msg)
  time.sleep(2)

