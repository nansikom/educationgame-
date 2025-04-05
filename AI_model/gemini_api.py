from google import genai
import os

client = genai.Client(api_key="AIzaSyDf987k_HpOVlnpddR3-Z4Ybxr8nP5cB0w" )

response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Generate 5 questions about differential calculus and generate 3 choices for each question. Also, write the answer of the questions just after the choices are given. Just extract me the text no additional useless information. Don't write any labels for questions or choices and just write the answer without label "
    
    )
questions = str(response.text)
print(questions)
with open("Sorting.txt", "w") as file: 
    file.write(questions)




