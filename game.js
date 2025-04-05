class Game {
    constructor(topics, modality) {
        this.generatedQuestions = false;
        this.questions = [];
        this.requestQuestionGeneration();
        this.t = 0;
    }
    update() {
        this.t++;
        if (!this.generatedQuestions) {
            this.tickQuestionGeneration();
        }
    }
    requestQuestionGeneration() {

    }
    tickQuestionGeneration() {
        if (this.t > 100) {
            this.generatedQuestions = true;
            this.questions = [];
            for (let n = 0; n < 10; n++) {
                this.questions.push({
                    prompt: "example question",
                    answers: ["answer1", "answer2", "answer3"],
                    correctAnswer: "answer1",
                    player: n % 2 + 1
                });
            }
        }
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game", 0, 100);

        ctx.restore();

        if (this.generatedQuestions) {
            ctx.save();
            ctx.translate(canvas.width / 2, 0);

            ctx.font = "60px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("generated!", 0, 400);

            ctx.restore();
        } else {
            ctx.save();
            ctx.translate(canvas.width / 2, 0);

            ctx.font = "60px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("loading questions...", 0, 400);

            ctx.restore();
        }
    }
}