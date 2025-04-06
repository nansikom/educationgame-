from google import genai
import os
import collections
import re
import csv
import json
from flask import Flask, request, jsonify

app = Flask(__name__)
def generate_evaluation(result):
    
    prompt = f"""
    
    This is the result of some questions that were asked in this topic.
    Results = {result}
    
    Generate an evaluation of what subjects that this individual should study 
    more based on the answers that they got right and wrong.
    
    
    Formatting Example:
        
    
    Return only json output without explanation.
    """
    
    client = genai.Client(api_key="AIzaSyDf987k_HpOVlnpddR3-Z4Ybxr8nP5cB0w") 

    response = client.models.generate_content(
    model="gemini-2.0-flash", contents= prompt
    )
    print(type(response))
    return (response)

    
# function that corrects the styling format for saving the json file
def strip_json_data(data):
    # remove the the style that starts with backtics and json or backticks as it kills how the file is saved
    if data.startswith("```json") or data.startswith("```"):
        # replace ` with  space 
        data = data.strip("`").strip()
        columns= data.splitlines()
        #remove the first and last line of (```json and ```)
        return"\n".join(columns[1:-1])
    return data
        
# function that gets the subject and throwws in the well formatted data to a json file saved in  a dictionary format
def convert_to_json_file(subject):
    # call function that returns the subject
    raw_data = generate_evaluation(evalutation="math")
    # strip the formatted data  from the ai
    raw_data_stripped = strip_json_data(raw_data)
    print(f"RAW DATA:\n{raw_data_stripped!r}")
    # load the json data 
    data = json.loads(raw_data_stripped)
    # throw it in datasource.json
    with open("data_source.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
        

@app.route ('/generate', methods = ['POST'])
def generate():
    # get the subject based on the request
    data = request.get_json()
    subject = data.get('subject')


    raw_data  = generate_response(subject)
    raw_data = raw_data.text.strip()

    # Remove code block formatting if present
    if raw_data.startswith("```"):
        raw_data = "\n".join(raw_data.splitlines()[1:-1])
        
    print(raw_data)
    questions = json.loads(raw_data)
    
    # print(raw_data, questions)
    try:
        # questions = json.loads(raw_data)
        return jsonify(questions), 200
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode JSON response"}), 500
if __name__ == '__main__':
    app.run(debug=True)