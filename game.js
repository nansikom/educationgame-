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
                if (this.currentRound.nextRound) {
                    this.createNextRound();
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
    }
    requestQuestionGeneration(topcis) {
        console.log("requested question generation: " + topics.toString());
    }
    tickQuestionGeneration() {
        if (this.t > 100) {
            this.generatedQuestions = true;
            this.questions = [];
            for (let n = 0; n < 10; n++) {
                var example = exampleQuestions[n];
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
        } else {
            this.drawLoadingQuestions();
        }

        this.player1.draw();
        this.player2.draw();
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
        ctx.fillText("Game Complete!", 0, 400);

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
        for (let n = 0; n < answers.length; n++) {
            let button = new Button();
            button.text = answers[n];
            button.font = "30px Arial";
            button.yOffset = 100 + n * 125;
            button.y = button.yOffset + this.y;
            button.w = 800;
            button.h = 100;
            button.x = canvas.width / 2 - button.w / 2 + this.x;
            this.answerButtons.push(button);
        }

        this.startAnimation = 450;
    }
    update() {
        if (this.startAnimation <= 0) {
            if (this.answered) {
                this.answeredAnimation++;
                if (this.answeredAnimation > 100) this.nextRound = true;
            }
            this.timeToAnswer--;
        }
        this.startAnimation--;

        this.updatePosition();
    }
    updatePosition() {
        this.y = canvas.height - this.h;
        for (let button of this.answerButtons) {
            button.x = canvas.width / 2 - button.w / 2 + this.x;
            button.y = button.yOffset + this.y;
            if (button.clicked) {
                this.answered = true;
                if (button.text === this.correctAnswer) {
                    this.answeredCorrect = true;
                }
            }
        }
    }
    drawBackground() {
        if (!this.answeredAnimation) return;

        ctx.save();
        if (this.answeredCorrect) {
            ctx.fillStyle = "lime";
        } else {
            ctx.fillStyle = "red";
        }
        ctx.globalAlpha = easeInOut(this.answeredAnimation / 10);
        ctx.fillRect(0, 0, this.w, this.h);
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
            var a = this.startAnimation - 300;
            var x = easeInOut((a - 130) / 20) * -200 + (1 - easeInOut(a / 20)) * 200;
            var playerName = this.player == "player 1" ? "Player 1" : "Player 2";
            ctx.globalAlpha = 1 - easeInOut((a - 130) / 20) - (1 - easeInOut(a / 20));
            ctx.fillText(`Round ${this.questionNumber + 1}: ${playerName}`, x, this.h / 2);
        } else if (this.startAnimation > 200) {
            ctx.fillText("3", 0, this.h / 2);
        } else if (this.startAnimation > 100) {
            ctx.fillText("2", 0, this.h / 2);
        } else if (this.startAnimation > 0) {
            ctx.fillText("1", 0, this.h / 2);
        } else if (this.startAnimation > -100) {
            var s = 0.5 + (-this.startAnimation / 100 * 5) ** 4;
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
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = easeInOut(-this.startAnimation / 50);
            this.drawBackground();
            ctx.restore();
            this.drawQuestion();
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        this.drawStartAnimation();
        ctx.restore();
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
        this.name = "Unnamed Player";
    }
    get healthPercent() {
        return this.health / this.maxHealth;
    }
    updateAnimations() {
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

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