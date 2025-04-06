from google import genai
import os
import collections
import re
import csv
import json


def generate_response(subject):
    
    prompt = f"""
    
    Generate 5 questions about {subject}. For each questions as:
    1. Generate 3 choices
    2. Select the answers from the choices
    3. Format the response as JSON array of objects:
        a. "question"
        b. "choices": {"a", "b", "c"}
        c. "answers": "a" or "b" or "c"
    
    
    Formatting Example:
        [
            {{
            "The question that is generated": {{
                "choices": ["a", "b", "c"],
                "answer" : "a" or "b" or "c"
                }}
            }}
        ]
    
    Return only json output without explanation.
    """
    
    client = genai.Client(api_key="AIzaSyDf987k_HpOVlnpddR3-Z4Ybxr8nP5cB0w") 

    response = client.models.generate_content(
    model="gemini-2.0-flash", contents= prompt
    )
    return (response.text)
    
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
    raw_data = generate_response(subject="math")
    # strip the formatted data  from the ai
    raw_data_stripped = strip_json_data(raw_data)
    print(f"RAW DATA:\n{raw_data_stripped!r}")
    # load the json data 
    data = json.loads(raw_data_stripped)
    # throw it in datasource.json
    with open("data_source.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
        

subject = "math"
convert_to_json_file(subject)

    
    


