function easeInOut(a) {
    a = 1.02 / (1 + 2.71828 ** (-10 * (a - 0.5))) - 0.007;
    return Math.min(Math.max(a, 0), 1);
}

class Game {
    constructor(topics, modality) {
        this.generatedQuestions = false;
        this.modality = modality;
        this.questions = [];
        this.requestQuestionGeneration(topics);
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
        this.player1.name = "Player 1";
        this.player2 = new Player();
        this.player2.name = "Player 2";
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
                        if (damage < 0) {
                            self.damage(-damage);
                        } else {
                            opponent.damage(damage);
                        }
                    }
                }
                if (this.currentRound.nextRound && this.player1.animationsCompleted && this.player2.animationsCompleted && this.nextRoundButton.clicked && !this.dealDamageTimer) {
                    if (this.player1.health <= 0 || this.player2.health <= 0) {
                        this.gameCompleted = true;
                    } else {
                        this.damageDealtForRound = false;
                        this.createNextRound();
                    }
                }
            }
        }
    }
    updateEffects() {
        this.player1.x = 60;
        this.player1.y = 50;
        this.player2.x = canvas.width - 60;
        this.player2.y = 50;

        this.player1.updateAnimations();
        this.player2.updateAnimations();

        this.backButton.y = canvas.height - 150;
        this.backButton.x = canvas.width / 2 - this.backButton.w / 2;

        this.nextRoundButton.x = canvas.width / 2 - this.nextRoundButton.w / 2;
    }
    requestQuestionGeneration(topics) {
        const fetchquestions = async () => {
            const subject = document .getElementById("topics").value;
            const response  = await fetch('http://localhost:5000/generate',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({subject})
            });

            
            const data = await response.json();
            console.log(data);

        }
        fetchquestions();
    }
    tickQuestionGeneration() {
        if (this.t > 1) {
            this.generatedQuestions = true;
            this.questions = [];
            for (let n = 0; n < 10; n++) {
                let example = exampleQuestions[n];
                this.questions.push({
                    prompt: example.prompt,
                    answers: example.answers,
                    correctAnswer: example.correctAnswer,
                    player: "player " + (n % 2 + 1),
                    questionNumber: Math.floor(n / 2)
                });
            }
        }
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
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
        ctx.font = "30px Arial";
        ctx.fillText(subText, x, y + 50);
    }
    drawLoadingQuestions() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game", 0, 100);
        ctx.fillText("generating questions...", 0, 400);

        ctx.restore();
    }
    drawGameComplete() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (this.player1.health > this.player2.health) {
            ctx.fillText("Player 1 Wins!", 0, 400);
        } else if (this.player1.health < this.player2.health) {
            ctx.fillText("Player 2 Wins!", 0, 400);
        } else {
            ctx.fillText("It's a Tie!", 0, 400);
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
        this.answeredCorrect = false;
        this.answeredAnimation = 0;
        this.nextRound = false;
        this.timeUp = false;
        this.timeUpAnimation = 0;
        this.score = 0;
        for (let n = 0; n < answers.length; n++) {
            let button = new Button();
            button.text = answers[n];
            button.font = "30px Arial";
            button.yOffset = 100 + n * 100;
            button.y = button.yOffset + this.y;
            button.w = 800;
            button.h = 80;
            button.x = canvas.width / 2 - button.w / 2 + this.x;
            this.answerButtons.push(button);
        }

        this.startAnimation = 450;
        this.startAnimation = 0;
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
                        } else {
                            this.score = -20;
                        }
                    }
                }
                if (this.timeToAnswer === 0) {
                    this.timeUp = true;
                    this.score = -20;
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
    }
    drawBackground() {
        if (this.answeredAnimation) {
            ctx.save();
            ctx.globalAlpha = easeInOut(this.answeredAnimation / 10);
            if (this.answeredCorrect) {
                ctx.fillStyle = "lime";
            } else {
                ctx.fillStyle = "red";
            }
            ctx.fillRect(0, 0, this.w, this.h);
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
        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText("Time's Up!", this.x + this.w / 2, this.y + this.h / 2);
        ctx.restore();
    }
    drawTimeLeft() {
        ctx.font = "30px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.save();
        ctx.translate(50, this.h - 50);
        ctx.fillText(`Time Left: ${Math.floor(this.timeToAnswer / 100)}s`, 0, 0);
        ctx.restore();
    }
    drawQuestion() {
        ctx.save();
        ctx.translate(this.x + canvas.width / 2, this.y);

        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(this.prompt, 0, 50);

        ctx.restore();

        for (let button of this.answerButtons) {
            button.draw();
        }
    }
    drawStartAnimation() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.fillStyle = "black";
        ctx.font = "60px Arial";
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
        this.answered = true;
        this.answeredAnimation = 0;
        this.nextRound = true;
    }
    update() {

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
    }
    get healthPercent() {
        return this.health / this.maxHealth;
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
    }
    drawHealth() {
        ctx.fillStyle = "black";
        ctx.fillRect(-50, 50, 100, 10);
        ctx.fillStyle = "red";
        ctx.fillRect(-50, 50, 100 * this.healthPercent, 10);
    }
    drawName() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, 0, 80);
    }
}