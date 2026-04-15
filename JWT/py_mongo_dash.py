import time
import pymongo
import dash
from dash.dependencies import Output, Input
import paho.mqtt.client as mqtt
import datetime
from dash import dcc
from dash import html
import plotly
import random
import plotly.graph_objs as go
from collections import deque
import dash_bootstrap_components as dbc
import paho.mqtt.client as mqtt
import dash_daq as daq
import statistics


LEN=30
X = deque(maxlen = LEN)
X.append(1)
Y = deque(maxlen = LEN)
Y.append(25)
Last=25
Average=25
Count=0

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["comftech_data"]
mycol = mydb["sensordata"]
mydoc = mycol.find()

app = dash.Dash(__name__)

app.layout =  html.Table(
    html.Tr([
    html.Td(    
    html.Div([    
        dcc.Graph(id = 'live-graph',
                  animate = True),
        dcc.Interval(
            id = 'graph-update',
            interval = 800,
            n_intervals = 0
        ),
    ])),
    html.Td(
    html.Div([    
        daq.Gauge(
          id='my-gauge-1',
          label="Last value",
          showCurrentValue=True,
          size=200,
          max=45
        )
       ])),
    html.Td(
    html.Div([    
        daq.Gauge(
          id='my-gauge-2',
          label="Average value",
          showCurrentValue=True,
          size=200,
          max=45
        )
       ]))   
    ]))


@app.callback(
    Output('live-graph', 'figure'),
    [ Input('graph-update', 'n_intervals') ]
)

def update_graph_scatter(n):
    YL=list(Y)
    print(YL)
    data = plotly.graph_objs.Scatter(
        x=list(X),
        y=YL,
        name='Scatter',
        mode= 'lines+markers'
    )
    return {'data': [data],
        'layout' : go.Layout(xaxis=dict(
        range=[min(X),max(X)]),yaxis = 
        dict(range = [min(Y),max(Y)]),
    )}


@app.callback(
    Output('my-gauge-1', 'value'), 
    Output('my-gauge-2', 'value'),
    [ Input('graph-update', 'n_intervals') ]
)

def update_output(value):
    global Last
    global Average
    print(Last,Average)
    return [Last,Average]

for record in mydoc:
    print(record)
    v = int(record['value'])
    print(record)
    if (len(X)==20):
        X.popleft()
        Y.popleft()
    X.append(X[-1]+1)
    Y.append(v)
    Last=v
    Average=statistics.mean(Y)
    sm=str(Average)
    print("average value: "+sm)

if __name__ == "__main__":
    app.run_server(debug=True)
