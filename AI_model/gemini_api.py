from google import genai

client = genai.Client(api_key="AIzaSyDf987k_HpOVlnpddR3-Z4Ybxr8nP5cB0w" )

response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Generate 5 questions about differential calculus"
)
print(response.text)
