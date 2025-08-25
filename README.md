# ELearn - AI-Powered Interactive Learning Game 🎮📚

[![Devpost](https://img.shields.io/badge/Devpost-Pysch2Learn-blue?style=for-the-badge&logo=devpost)](https://devpost.com/software/pysch2learn)

ELearn is an interactive, AI-powered learning web app that makes studying fun through gamification. It uses **Gemini AI** to generate real-time subject-based questions and delivers a personalized learning experience through gameplay and feedback.

## 👥 Team Members

- **John**
- **Faith**
- **Jiya** 
- **Mary**

## 🎯 Game Type

**WebApp Game** - Interactive Educational Platform

## 🎮 Game Overview

### Getting Started
The project begins with a welcome screen displaying the game name and a start button. Users can then choose between:
- **Single Player Mode**
- **Multiplayer Mode** (2 players)

### 👤 Single Player Mode

1. **Subject Selection**: User inputs their desired subject (e.g., Math, Science, History)
2. **AI Question Generation**: Gemini AI generates real-time questions based on the selected subject
3. **Interactive Feedback**: 
   - ✅ **Green background** for correct answers
   - ❌ **Red background** for wrong answers
4. **Personalized Learning**: Game identifies weak areas and suggests targeted practice at the end

### 👥 Multiplayer Mode

1. **Turn-Based Gameplay**: Both players take turns answering questions
2. **Scoring System**: Game tracks each player's score and health points
3. **Health Impact**: Wrong answers reduce health points by **-20 points**
4. **Personalized Feedback**: Each player receives evaluation based on performance and personalized lessons

## 🛠️ Installation & Setup

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Running the Application

#### Start the Gemini API Server
```bash
python gemini_api.py
```
- **Port**: 5001

#### Start the Evaluation Server
```bash
python evaluation.py
```
- **Port**: 5002

## ⚠️ Important API Quota Notice

**Gemini API Rate Limits**: If you encounter quota limit errors while using the Gemini API, you may need to upgrade your Google Cloud plan for higher usage limits. The free tier has restricted quotas that can be quickly exhausted during gameplay.

## 🔗 Project Links

- **Devpost Submission**: [Pysch2Learn | Devpost](https://devpost.com/software/pysch2learn)

## 🚀 Features

- **Real-time AI Question Generation** using Gemini API
- **Gamified Learning Experience** with visual feedback
- **Single & Multiplayer Modes** for varied gameplay
- **Personalized Learning Recommendations** based on performance
- **Health Points System** for competitive multiplayer experience
- **Subject-based Learning** across multiple academic areas

## 🎓 Educational Impact

ELearn transforms traditional learning by combining AI technology with game mechanics to create an engaging educational experience that adapts to individual learning patterns and provides targeted improvement suggestions.
