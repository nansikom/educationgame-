from google import genai
import os
import collections
import re
import csv
import json
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app, origins=["null"])
def generate_evaluation(result):
    
    prompt = f"""
    
    This is the result of some questions that were asked in this topic.
    Results = {result}
    
    Generate a lesson plan of what areas in this subject that this individual should study 
    more based on the answers that they got right and wrong.
    
    
    Formatting Example:
        {{You got n number of questions wrong and n number of questions right.
            Here is a list of areas that you need to work on:
            a) "Dot Product"
            b) "Cross Product"
            c) "Vector addition"
            
            Here is your lesson plan and additional questions to test yourself:
            
            a) "Qn", "answer"
            b) "Qn", "answer"
            c) "Qn", "answer"
        }}
    
    Return only text output with explanation focusing more on personalizing it for them.
    """
    
    
    client = genai.Client(api_key="AIzaSyDf987k_HpOVlnpddR3-Z4Ybxr8nP5cB0w") 

    response = client.models.generate_content(
    model="gemini-2.0-flash", contents= prompt
    )
    print(type(response))
    return (response.text)

    

@app.route ('/lessonplan', methods = ['POST'])


def lessonplan():
    result = request.data.decode("utf-8")
    raw_data  = generate_evaluation(result)
    return raw_data

if __name__ == '__main__':
    app.run(debug=True, port=5001)