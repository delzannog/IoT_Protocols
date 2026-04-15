from fastapi import FastAPI
import jwt
import json
import pymongo
from paho.mqtt.client import Client

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}



