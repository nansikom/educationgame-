function easeInOut(a) {
    a = 1.02 / (1 + 2.71828 ** (-10 * (a - 0.5))) - 0.007;
    return Math.min(Math.max(a, 0), 1);
}

class Game {
    constructor(modality) {
        this.questionsAnswered = {
            "player 1": [],
            "player 2": []
        };

        this.evaluation = false;
        this.generatedQuestions = false;
        this.modality = modality;
        this.questions = [];
        this.t = 0;
        this.turn = false;
        this.questionNumber = false;
        this.currentRound = false;
        this.gameCompleted = false;
        this.damageDealtForRound = false;
        this.dealDamageTimer = 0;

        this.nextRoundButton = new Button();
        this.nextRoundButton.text = "Next Round";
        this.nextRoundButton.w = 300;
        this.nextRoundButton.h = 100;
        this.nextRoundButton.x = canvas.width / 2 - this.nextRoundButton.w / 2;
        this.nextRoundButton.y = 100;

        this.backButton = new Button();
        this.backButton.text = "Back";
        this.backButton.w = 200;
        this.backButton.h = 100;
        this.backButton.x = canvas.width / 2 - this.backButton.w / 2;
        this.backButton.y = canvas.height - 150;

        this.player1 = new Player();
        this.player1.name = playerNames[0];
        this.player2 = new Player();
        this.player2.name = playerNames[1];
        this.player1.originX = 100;
        this.player1.originY = 100;
        this.player2.originX = canvas.width - 100;
        this.player2.originY = 100;
        this.player1.x = this.player1.originX;
        this.player1.y = this.player1.originY;
        this.player2.x = this.player2.originX;
        this.player2.y = this.player2.originY;
    }
    createNextRound() {
        if (this.questionNumber === false) this.questionNumber = 0;
        if (this.turn === false) {
            this.turn = "player 1";
        } else {
            if (this.turn === "player 1") {
                this.turn = "player 2";
            } else if (this.turn === "player 2") {
                this.turn = "player 1";
                this.questionNumber++;
            }
        }

        if (this.modality == "multiplayer") {
            let question = this.questions.find(e => e.player == this.turn && e.questionNumber == this.questionNumber);
            if (!question) {
                this.gameCompleted = true;
                return;
            }
            this.currentRound = new QuestionRound(question);
        } else if (this.modality == "singleplayer") {
            if (this.turn == "player 1") {
                let question = this.questions.find(e => e.player == this.turn && e.questionNumber == this.questionNumber);
                if (!question) {
                    this.gameCompleted = true;
                    return;
                }
                this.currentRound = new QuestionRound(question);
            } else {
                this.currentRound = new AIRound();
            }
        }
    }
    update() {
        this.updateEffects();
        this.t++;
        let opponent;
        let self;
        if (this.turn == "player 1") {
            opponent = this.player2;
            self = this.player1;
        } else if (this.turn == "player 2") {
            opponent = this.player1;
            self = this.player2;
        }
        if (this.gameCompleted) {
            if (this.backButton.clicked) {
                targetPage = "title page";
                pageTransitionBackwards = true;
            }
        } else {
            if (!this.generatedQuestions) {
                this.tickQuestionGeneration();
            } else {
                if (!this.currentRound) {
                    this.createNextRound();
                }
                this.currentRound.update();
                if ((this.currentRound.answered || this.currentRound.timeUp) && !this.damageDealtForRound) {
                    this.damageDealtForRound = true;
                    this.dealDamageTimer = 200;
                }
                if (this.dealDamageTimer) {
                    this.dealDamageTimer--;
                    if (this.dealDamageTimer === 1) {
                        let damage = this.currentRound.score;
                        var question = {
                            question: this.currentRound.prompt,
                            answer: this.currentRound.chosenAnswer,
                            result: this.currentRound.timeUp ? "ran out of time" : this.currentRound.answeredCorrect ? "answered correctly" : "answered incorrectly"
                        }
                        this.questionsAnswered[this.turn].push(question);
                        if (damage < 0) {
                            self.damage(-damage);
                        } else {
                            opponent.damage(damage);
                        }
                    }
                }
                if (this.currentRound.nextRound && this.player1.animationsCompleted && this.player2.animationsCompleted && !this.dealDamageTimer) {
                    if (this.player1.health <= 0 || this.player2.health <= 0 || this.questionNumber == 4) {
                        this.nextRoundButton.text = "View Results";
                    } else {
                        this.nextRoundButton.text = "Next Round";
                    }
                }
                if (this.currentRound.nextRound && this.player1.animationsCompleted && this.player2.animationsCompleted && this.nextRoundButton.clicked && !this.dealDamageTimer) {
                    if (this.player1.health <= 0 || this.player2.health <= 0 || this.questionNumber == 4) {
                        this.gameCompleted = true;
                        this.requestEvaluationGeneration(this.questionsAnswered);
                    } else {
                        this.damageDealtForRound = false;
                        this.createNextRound();
                    }
                }
            }
        }
    }
    updateEffects() {
        this.player1.originX = 100;
        this.player1.originY = 100;
        this.player2.originX = canvas.width - 100;
        this.player2.originY = 100;

        var player1Target = { x: this.player1.originX, y: this.player1.originY };
        var player2Target = { x: this.player2.originX, y: this.player2.originY };
        if (this.turn == "player 1" && !this.showNextRoundButton) {
            player1Target.x = canvas.width / 2 - 300;
            this.player1.scale = this.player1.scale * 0.95 + 1.3 * 0.05;
        } else {
            this.player1.scale = this.player1.scale * 0.95 + 1 * 0.05;
        }
        if (this.turn == "player 2" && !this.showNextRoundButton) {
            player2Target.x = canvas.width / 2 + 300;
            this.player2.scale = this.player2.scale * 0.95 + 1.3 * 0.05;
        } else {
            this.player2.scale = this.player2.scale * 0.95 + 1 * 0.05;
        }
        if (this.gameCompleted) {
            if (this.player1.health > this.player2.health) {
                this.player1.won = true;
                player1Target = { x: canvas.width / 2, y: 250 };
            } else if (this.player1.health < this.player2.health) {
                this.player2.won = true;
                player2Target = { x: canvas.width / 2, y: 250 };
            } else {
                this.player1.won = true;
                this.player2.won = true;
                player1Target = { x: canvas.width / 2 + 50, y: 250 };
                player2Target = { x: canvas.width / 2 - 50, y: 250 };
            }
        }
        var p = 0.05;

        this.player1.x = this.player1.x * (1 - p) + player1Target.x * p;
        this.player1.y = this.player1.y * (1 - p) + player1Target.y * p;
        this.player2.x = this.player2.x * (1 - p) + player2Target.x * p;
        this.player2.y = this.player2.y * (1 - p) + player2Target.y * p;

        this.player1.updateAnimations();
        this.player2.updateAnimations();

        this.backButton.y = 50;
        this.backButton.x = 50;

        this.nextRoundButton.x = canvas.width / 2 - this.nextRoundButton.w / 2;
    }
    requestQuestionGeneration(topics) {
        this.questions = [];
        const fetchquestions = async (topic, player) => {
            fetch('http://127.0.0.1:5001/generate',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        subject: topic
                    })
                })
                .then(response => response.json())
                .then(data => {
                    game.addQuestionData(data, player);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        fetchquestions(topics[0], "player 1");
        fetchquestions(topics[1], "player 2");
    }
    requestEvaluationGeneration(result) {
        const fetchresult = async (inputData) => {
            fetch('http://127.0.0.1:5002/lessonplan',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: JSON.stringify(inputData)
                }
            )
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    game.evaluation = JSON.parse(data.slice(8, -4));
                })
                .catch(error => {
                    console.log('Error: ', error)
                })
        }
        fetchresult(result);
    }
    addQuestionData(data, player) {
        console.log(data);
        data = data.map(function (e) {
            var key = Object.keys(e)[0];
            var answers = e[key].choices;
            var correctAnswer = answers["abc".indexOf(e[key].answer)];
            return {
                prompt: key,
                answers: answers,
                correctAnswer: correctAnswer
            }
        });
        for (let n = 0; n < data.length; n++) {
            let q = data[n];
            q.player = player;
            q.questionNumber = n;
            this.questions.push(q);
        }
        if (this.questions.length == 10) this.generatedQuestions = true;
    }
    tickQuestionGeneration() {
    }
    draw() {
        if (this.gameCompleted) {
            this.drawGameComplete();
        } else if (this.generatedQuestions) {
            if (this.currentRound) {
                this.currentRound.draw();
            }
            if (this.currentRound.nextRound && this.player1.animationsCompleted && this.player2.animationsCompleted && !this.dealDamageTimer && this.damageDealtForRound) {
                this.nextRoundButton.draw();
                this.showNextRoundButton = true;
            } else {
                this.showNextRoundButton = false;
            }
        } else {
            this.drawLoadingQuestions();
        }

        this.player1.draw();
        this.player2.draw();

        if (this.dealDamageTimer) {
            this.drawDealDamage();
        }
    }
    drawDealDamage() {
        let text, subText;
        let opponent;
        let self;
        let target;
        if (this.turn == "player 1") {
            opponent = this.player2;
            self = this.player1;
        } else if (this.turn == "player 2") {
            opponent = this.player1;
            self = this.player2;
        }
        if (this.currentRound.timeUp) {
            text = "You ran out of time!";
            subText = this.currentRound.score + " health";
            target = self;
        } else if (this.currentRound.answeredCorrect) {
            text = "Correct!";
            if (this.currentRound.timeToAnswer > 800) {
                text = "Super Fast!"
            }
            subText = this.currentRound.score + " damage";
            target = opponent;
        } else {
            text = "Incorrect!";
            subText = this.currentRound.score + " health";
            target = self;
        }
        let a = easeInOut((20 - this.dealDamageTimer) / 20);
        let x = (canvas.width / 2) * (1 - a) + target.x * a;
        let y = 100 * (1 - a) + target.y * a;
        ctx.fillStyle = "black";
        ctx.font = "50px KanitLight";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
        ctx.font = "30px KanitLight";
        ctx.fillText(subText, x, y + 50);
    }
    drawLoadingQuestions() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px KanitLight";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        var w = ctx.measureText("Generating...").width;
        ctx.fillText("Generating" + ".".repeat(1 + Math.floor(this.t % 150 / 50)), -w / 2, 400);

        ctx.restore();
    }
    drawGameComplete() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px KanitLight";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (this.player1.health > this.player2.health) {
            ctx.fillText(this.player1.name + " Wins!", 0, 100);
        } else if (this.player1.health < this.player2.health) {
            ctx.fillText(this.player2.name + " Wins!", 0, 100);
        } else {
            ctx.fillText("It's a Tie!", 0, 100);
        }

        if (!this.evaluation) {
            ctx.font = "30px KanitLight";
            ctx.fillText("Loading evaluation" + ".".repeat(1 + Math.floor(this.t % 150 / 50)), 0, 400);
        } else {
            var p1 = new Paragraph(this.player1.name + ": " + this.evaluation["player 1"]);
            p1.x = -400;
            p1.w = 800;
            p1.y = 350;
            p1.h = 150;
            p1.calculateLines();
            var p2 = new Paragraph(this.player2.name + ": " + this.evaluation["player 2"]);
            p2.x = -400;
            p2.w = 800;
            p2.y = 550;
            p2.h = 150;
            p2.calculateLines();
            p1.draw();
            p2.draw();
        }

        ctx.restore();

        this.backButton.draw();
    }
}

class QuestionRound {
    constructor({ prompt, answers, correctAnswer, player, questionNumber }) {
        this.w = canvas.width;
        this.h = 500;
        this.x = 0;
        this.y = canvas.height - this.h;

        this.prompt = prompt || "";
        this.answers = answers || [];
        this.correctAnswer = correctAnswer || "";
        this.player = player || "player 1";
        this.questionNumber = questionNumber || 0;
        this.timeToAnswer = 1000;
        this.answerButtons = [];
        this.answered = false;
        this.chosenAnswer = null;
        this.answeredCorrect = false;
        this.answeredAnimation = 0;
        this.nextRound = false;
        this.timeUp = false;
        this.timeUpAnimation = 0;
        this.score = 0;
        for (let n = 0; n < answers.length; n++) {
            let button = new QuizButton();
            if (this.correctAnswer === answers[n]) button.correct = true;
            button.text = answers[n];
            button.font = "30px KanitLight";
            button.yOffset = 130 + n * 100;
            button.y = button.yOffset + this.y;
            button.w = 800;
            button.h = 80;
            button.x = canvas.width / 2 - button.w / 2 + this.x;
            this.answerButtons.push(button);
        }

        this.paragraph = new Paragraph(this.prompt);

        this.startAnimation = 450;
        // this.startAnimation = 0;
    }
    update() {
        if (this.startAnimation <= 0) {
            if (this.answered) {
                this.answeredAnimation++;
                if (this.answeredAnimation == 100) {
                    this.nextRound = true;
                }
            } else if (this.timeUp) {
                this.timeUpAnimation++;
                if (this.timeUpAnimation == 100) {
                    this.nextRound = true;
                }
            } else {
                this.timeToAnswer--;
                for (let button of this.answerButtons) {
                    if (button.clicked) {
                        this.answered = true;
                        if (button.text === this.correctAnswer) {
                            this.answeredCorrect = true;
                            this.score = 20;
                            if (this.timeToAnswer > 800) this.score = 30;
                        } else {
                            this.score = -10;
                        }
                        this.chosenAnswer = button.text;
                    }
                }
                if (this.timeToAnswer === 0) {
                    this.timeUp = true;
                    this.score = -10;
                } else {
                    for (let button of this.answerButtons) {
                        button.update();
                    }
                }
            }
        }
        this.startAnimation--;

        this.updatePosition();
    }
    updatePosition() {
        this.y = canvas.height - this.h;
        this.w = canvas.width;
        for (let button of this.answerButtons) {
            button.x = canvas.width / 2 - button.w / 2 + this.x;
            button.y = button.yOffset + this.y;
        }

        this.paragraph.x = canvas.width / 2 - 400;
        this.paragraph.y = this.y;
        this.paragraph.w = 800;
        this.paragraph.h = 130;
        this.paragraph.calculateLines();
    }
    drawBackground() {
        if (this.answeredAnimation) {
            ctx.save();
            ctx.globalAlpha = 1 - easeInOut(this.answeredAnimation / 100);
            if (this.answeredCorrect) {
                ctx.fillStyle = "rgb(200,255,200)";
            } else {
                ctx.fillStyle = "rgb(255,200,200)";
            }
            ctx.fillRect(0, -this.h, this.w, this.h * 2);
            ctx.restore();
        }
    }
    drawTimeUpAnimation() {
        if (!this.timeUpAnimation) return;
        ctx.save();
        ctx.globalAlpha = easeInOut(this.timeUpAnimation / 20);
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y + this.h / 3 - 10, this.w, this.h / 3 + 20);
        ctx.fillStyle = "rgb(255,200,200)";
        ctx.fillRect(this.x, this.y + this.h / 3, this.w, this.h / 3);
        ctx.font = "60px KanitLight";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText("Time's Up!", this.x + this.w / 2, this.y + this.h / 2);
        ctx.restore();
    }
    drawTimeLeft() {
        ctx.font = "30px KanitLight";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.save();
        ctx.translate(40, this.h - 40);
        ctx.fillText(`Time Left: ${Math.floor(this.timeToAnswer / 100)}s`, 0, 0);
        ctx.restore();
    }
    drawQuestion() {
        this.paragraph.draw();

        for (let button of this.answerButtons) {
            button.draw();
        }
    }
    drawStartAnimation() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.fillStyle = "black";
        ctx.font = "100px KanitBold";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (this.startAnimation > 300) {
            let a = this.startAnimation - 300;
            let x = easeInOut((a - 130) / 20) * -200 + (1 - easeInOut(a / 20)) * 200;
            let playerName = this.player == "player 1" ? "Player 1" : "Player 2";
            ctx.globalAlpha = 1 - easeInOut((a - 130) / 20) - (1 - easeInOut(a / 20));
            ctx.fillText(`Round ${this.questionNumber + 1}: ${playerName}`, x, this.h / 2);
        } else if (this.startAnimation > 200) {
            ctx.fillText("3", 0, this.h / 2);
        } else if (this.startAnimation > 100) {
            ctx.fillText("2", 0, this.h / 2);
        } else if (this.startAnimation > 0) {
            ctx.fillText("1", 0, this.h / 2);
        } else if (this.startAnimation > -100) {
            let s = 0.5 + (-this.startAnimation / 100 * 5) ** 4;
            ctx.save();
            ctx.translate(0, this.h / 2);
            ctx.scale(s, s);
            ctx.globalAlpha = easeInOut(-this.startAnimation / 10) - easeInOut((-this.startAnimation - 50) / 20);
            ctx.fillText("GO!", 0, 0);
            ctx.restore();
        }

        ctx.restore();
    }
    draw() {
        if (this.startAnimation <= 0) {
            ctx.save();
            ctx.globalAlpha = easeInOut(-this.startAnimation / 50);
            ctx.save();
            ctx.translate(this.x, this.y);
            this.drawBackground();
            this.drawTimeLeft();
            ctx.restore();
            this.drawQuestion();
            ctx.restore();
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        this.drawStartAnimation();
        ctx.restore();

        this.drawTimeUpAnimation();
    }
}

class AIRound {
    constructor() {
        this.w = canvas.width;
        this.h = 500;
        this.x = 0;
        this.y = canvas.height - this.h;

        this.player = "player 2";
        this.timeToAnswer = 1000;
        this.answered = true;
        this.answeredCorrect = true;
        this.answeredAnimation = 0;
        this.nextRound = true;
        this.timeUp = false;
        this.timeUpAnimation = 0;
        this.score = 10;
        this.startAnimation = 0;
    }
    update() {
        this.answeredAnimation++;
        if (this.answeredAnimation == 100) {
            this.nextRound = true;
        }
        this.updatePosition();
    }
    updatePosition() {
        this.y = canvas.height - this.h;
        this.w = canvas.width;
    }
    draw() {

    }
}

class Player {
    constructor() {
        this.health = 100;
        this.maxHealth = 100;
        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.damageAnimation = 0;
        this.name = "Unnamed Player";
        this.animationsCompleted = true;
        this.won = false;
    }
    get healthPercent() {
        return Math.max(Math.min(1, this.health / this.maxHealth), 0);
    }
    updateAnimations() {
        this.animationsCompleted = true;
        if (this.damageAnimation) {
            this.damageAnimation--;
            this.animationsCompleted = false;
        }
    }
    damage(amount) {
        this.health -= amount;
        this.damageAnimation = 20;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        if (this.damageAnimation) {
            let angle = (Math.random() - 0.5) * this.damageAnimation;
            ctx.rotate(angle * Math.PI / 180);
        }

        this.drawHealth();
        this.drawSprite();
        this.drawName();

        ctx.restore();
    }
    drawSprite() {
        ctx.fillStyle = "blue";
        ctx.fillRect(-40, -40, 80, 80);

        if (this.won) {
            ctx.drawImage(document.getElementById("crown-image"), -40, -110, 80, 80);
        }
    }
    drawHealth() {
        ctx.fillStyle = "black";
        ctx.fillRect(-50, 50, 100, 10);
        ctx.fillStyle = "red";
        ctx.fillRect(-50, 50, 100 * this.healthPercent, 10);
    }
    drawName() {
        ctx.fillStyle = "black";
        ctx.font = "20px KanitLight";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, 0, 80);
    }
}