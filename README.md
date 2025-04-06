Members: John, Faith, Jiya, Mary
Type: WebApp Game

Game Description: ELearn is an interactive, AI-powered learning web app that 
makes studying fun through gamification. It uses Gemini AI to generate real-time 
subject-based questions and delivers a personalized learning experience through 
gameplay and feedback.

The project starts here, displaying the name of the game and start button

Then asks the user if it is a single 
player or multiplayer(2 players).

Depending on the user's choice:

### Single Player Mode
- User inputs the subject(e.g., Math, Science, History).
- Gemini AI generates a set of questions in real time.
- The user answers each question and gets to receives a green background if 
they chose right and a red background for wrong.
- Based on performance, the game identifies weak areas and suggests targeted 
practice at the end of the game.a

### Multiplayer Mode
- Both Players Take turns answering questions.
- The game keeps track of each player's score and health points(when they get 
something wrong, their health points are impacted -20points)
- At the end of the game, each player is evaluated based on what they got wrong
and given feedback and a personalized lesson. 

For running the .py files:
(python gemini_api.py)
- This uses port = 5001 
(python gemini_api.py)
- This uses port = 50002


