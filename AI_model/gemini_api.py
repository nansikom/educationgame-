from google import genai
import os
import collections
import re
import csv
import json


client = genai.Client(api_key="AIzaSyDf987k_HpOVlnpddR3-Z4Ybxr8nP5cB0w") 

response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Generate 5 questions about differential calculus and generate 3 choices for each question. Also, write the answer of the questions just after the choices are given. Just "
    
    )

def convert_to_question_dict_list(parsed_questions):
    result = []

    for q in parsed_questions:
        entry = {
            q["question"]: {
                "choices": q["choices"],
                "answer": q["answer"]
            }
        }
        result.append(entry)

    return result


def save_to_json(data, filename="questions.json"):
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
        
save_to_json(convert_to_question_dict_list(str(response.text)))




'''questions = str(response.text)
print(questions)

dict = collections.defaultdict(list)

# Write the response in a file.
def write_response(questions):
    with open("Sorting.txt", "w") as file:
        file.write(questions)
        


# creating the empty list 
sorted_display = []
def parse_in_questions():
    with open("Sorting.txt", "r") as file:
        

'''

