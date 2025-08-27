from google import genai
import os
import collections
import re
import csv
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.genai.errors import ClientError

app = Flask(__name__)
CORS(app, origins=["null"])
def generate_evaluation(result):
    try:
    
    prompt = f"""
    
    2 players were asked some questions, here is the result of the tests in JSON format:
    {result}
    
    Generate feedback for each player on what they're strengths are and what they should work on.
    Keep this feedback relatively short, 30 words or less.
    
    Return the following in JSON:
    {{
        "player 1": "feedback for player 1"
        "player 2": "feedback for player 2"
    }}
    
    Return only JSON output with no other text.
    """
    
    
    client = genai.Client(api_key="----") 

        response = client.models.generate_content(
        model="gemini-2.0-flash", contents= prompt
        )
        print(type(response))
        return (response.text)
    except  ClientError as e:
        print("API quota exceeded:", e)
        return json.dumps({"error": "API quota exceeded. Please try again later."})
# ...existing code...


    

@app.route ('/lessonplan', methods = ['POST'])


def lessonplan():
    result = request.data.decode("utf-8")
    raw_data  = generate_evaluation(result)
    return raw_data

if __name__ == '__main__':
    app.run(debug=True, port=5002)
