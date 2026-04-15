from flask import Flask, request
import jwt
import json
import pymongo
from paho.mqtt.client import Client

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
dblist = myclient.list_database_names()
mydb = myclient["comftech_data"]
mycol = mydb["sensordata"]	
for x in mycol.find():
  print(x)
   
app = Flask(__name__)
client = Client(client_id = "client_1")
client.connect("test.mosquitto.org")

@app.route('/login', methods=['POST'])
def login():
    content_type = request.headers.get('Content-Type')
    api_key = request.headers.get('Api-Key')
    if (content_type == 'application/json'):
        msg = request.json
        user=msg['email']
        pwd=msg['password']
        token = jwt.encode({"userId": "Gianky"}, "secret",  algorithm="HS256")
        print(user,pwd,token)
        data = {'userId':"Gianky",'accessToken': token}
        data=json.dumps(data)
        return data
    else:
        return 'Content-Type not supported!'

@app.route('/samples', methods=['POST'])
def samples():
    content_type = request.headers.get('Content-Type')
    api_key = request.headers.get('Api-Key')
    token = request.headers.get('Authorization')
    if (content_type == 'application/json'):
        msg = request.json
        userId=msg['userId']
        date=msg['date']
        value=msg['value']
        measureType=msg['measureType']
        print(userId,date,value,measureType)
        data=json.dumps(msg)
        client.publish(topic = "gdlz/gdash", payload = data) 
        x = mycol.insert_one({'user':userId,'date':date,'value':value,'measureType':measureType})
        print(x)
        data = { 'message':"OK" }
        data=json.dumps(data)        
        return data
    else:
        return 'Content-Type not supported!'


app.run()

