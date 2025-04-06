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
            if(!question) {
                this.gameCompleted = true;
                return;
            }
            this.currentRound = new QuestionRound(question);
        } else if (this.modality == "singleplayer") {
            if(this.turn=="player 1") {
                let question = this.questions.find(e => e.player == this.turn && e.questionNumber == this.questionNumber);
                if(!question) {
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
        this.t++;
        if (!this.generatedQuestions) {
            this.tickQuestionGeneration();
        } else {
            if (!this.currentRound) {
                this.createNextRound();
            }
            this.currentRound.update();
            if (this.currentRound.answered) {
                this.createNextRound();
            }
        }
    }
    requestQuestionGeneration(topcis) {
        console.log("requested question generation: " + topics.toString());
    }
    tickQuestionGeneration() {
        if (this.t > 100) {
            this.generatedQuestions = true;
            this.questions = [];
            for (let n = 0; n < 10; n++) {
                this.questions.push({
                    prompt: "example question " + n,
                    answers: ["answer1", "answer2", "answer3"],
                    correctAnswer: "answer1",
                    player: "player " + (n % 2 + 1),
                    questionNumber: Math.floor(n / 2)
                });
            }
        }
    }
    draw() {
        if(this.gameCompleted) {
            this.drawGameComplete();
        } else if(this.generatedQuestions) {
            if (this.currentRound) {
                this.currentRound.draw();
            }
        } else {
            this.drawLoadingQuestions();
        }
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
    }
}

class QuestionRound {
    constructor({ prompt, answers, correctAnswer, player, questionNumber }) {
        this.prompt = prompt || "";
        this.answers = answers || [];
        this.correctAnswer = correctAnswer || "";
        this.player = player || "player 1";
        this.questionNumber = questionNumber || 0;
        this.time = 1000;
        this.answerButtons = [];
        this.answered = false;
        this.answeredCorrect = false;
        for (let n = 0; n < answers.length; n++) {
            let button = new Button();
            button.text = answers[n];
            button.y = 250 + n * 125;
            button.w = 800;
            button.h = 100;
            button.x = canvas.width / 2 - button.w / 2;
            this.answerButtons.push(button);
        }
    }
    update() {
        this.time--;
        for (let button of this.answerButtons) {
            button.x = canvas.width / 2 - button.w / 2;
            if (button.clicked) {
                this.answered = true;
                if (button.text === this.correctAnswer) {
                    this.answeredCorrect = true;
                }
            }
        }
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Round " + (this.questionNumber + 1) + ": " + this.player + ": " + this.prompt, 0, 200);

        ctx.restore();

        for (let button of this.answerButtons) {
            button.draw();
        }
    }
}

class AIRound {
    constructor() {
        this.answered = true;
    }
    update() {

    }
    draw() {

    }
}