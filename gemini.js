const express = require("express");
const fs = require("fs");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const API_KEY = "AIzaSyDf987k_HpOVlnpddR3-Z4Ybxr8nP5cB0w";

function buildPrompt(subject) {
  return `
Generate 5 questions about ${subject}. For each question:
1. Generate 3 choices
2. Select the answer from the choices
3. Format the response as JSON array of objects:
    a. "question"
    b. "choices": {"a", "b", "c"}
    c. "answers": "a" or "b" or "c"

Formatting Example:
[
    {
    "The question that is generated": {
        "choices": ["a", "b", "c"],
        "answer": "a" or "b" or "c"
        }
    }
]

Return only JSON output without explanation.
  `;
}

async function generateResponse(subject) {
  const prompt = buildPrompt(subject);

  const res = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    {
      contents: [{ parts: [{ text: prompt }] }]
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
      }
    }
  );

  return res.data.candidates[0].content.parts[0].text;
}

app.post("/generate", async (req, res) => {
  const subject = req.body.subject || "math";
  try {
    const rawData = await generateResponse(subject);
    res.status(200).json(rawData);
  } catch (err) {
    console.error("Error generating questions:", err.message);
    res.status(500).json({ error: "Failed to generate or parse questions" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});