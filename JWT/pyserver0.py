from flask import Flask, request
import jwt
import json
import pymongo
from paho.mqtt.client import Client

app = Flask(__name__)

@app.route('/api', methods=['GET'])
def api():
    data = "OK"
    data=json.dumps(data)
    return data


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
        data1=json.dumps(msg)
        with open("data/samples.json", "a") as outfile:
    	    outfile.write(data1+"\n") 
        data = { 'message':"OK" }
        data=json.dumps(data)       
        return data
    else:
        return 'Content-Type not supported!'


app.run()

