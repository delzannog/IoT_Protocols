import requests
import json

# Define new data to create
new_data = {
    "date": 1,
    "value": 1,
    "userId": "Making a POST request",
    "measureType": "This is the data we created."
}

Headers = {
    "authorization": "our_unique_secret_token",
    "api-key": "xxx"
}

# The API endpoint to communicate with
url_post = 'http://localhost:4000/sample'

# A POST request to tthe API
post_response = requests.post('http://localhost:4000/sample', data=json.dumps(new_data), headers=Headers)
print(post_response)
