class Button {
    constructor() {
        this._x = 0;
        this._y = 0;
        this._w = 0;
        this._h = 0;
        this.padding = 10;
        this.borderRadius = 5;
        this.borderWidth = 3;
        this.borderColor = "black";
        this.backgroundColor = "white";
        this.hoverColor = "rgb(230,230,230)";
        this.textColor = "black";
        this.font = "50px KanitLight";
        this.maxFontSize = 50;
        this._text = "";
        this.paragraph = new Paragraph(this._text);
        this.paragraph.maxFontSize = 50;
    }
    set text(n) {
        this._text = n;
        this.paragraph.text = n;
        this.paragraph.calculateLines();
    }
    set x(n) {
        this._x = n;
        this.paragraph.x = n + this.padding;
    }
    get x() {
        return this._x;
    }
    set y(n) {
        this._y = n;
        this.paragraph.y = n + this.padding;
    }
    get y() {
        return this._y;
    }
    set w(n) {
        this._w = n;
        this.paragraph.w = n - this.padding * 2;
        this.paragraph.calculateLines();
    }
    get w() {
        return this._w;
    }
    set h(n) {
        this._h = n;
        this.paragraph.h = n - this.padding * 2;
        this.paragraph.calculateLines();
    }
    get h() {
        return this._h;
    }
    get text() {
        return this._text;
    }
    get hovered() {
        return Mouse.x > this.x && Mouse.y > this.y && Mouse.x < this.x + this.w && Mouse.y < this.y + this.h;
    }
    get clicked() {
        return this.hovered && Mouse.click;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.roundRect(0, 0, this.w, this.h, this.borderRadius);
        ctx.fillStyle = this.backgroundColor;
        if (this.hovered) ctx.fillStyle = this.hoverColor;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        this.paragraph.draw();
    }
}

class QuizButton extends Button {
    constructor() {
        super();
        this.correct = false;
    }
    update() {
        if (this.clicked) {
            if (this.correct) {
                this.backgroundColor = "rgb(50,255,50)";
            } else {
                this.backgroundColor = "rgb(255,50,50)";
            }
            this.hoverColor = this.backgroundColor;
        }
    }
    draw() {
        super.draw();
    }
}

class TextInputButton extends Button {
    constructor() {
        super();
        this.prompt = "empty prompt";
        this.altText = "";
        this.w = 350;
        this.h = 80;
        this.hoverColor = "rgb(240,240,240)";
    }
    update() {
        if (this.clicked) {
            var result = window.prompt(this.prompt);
            if (result !== null && result.length) {
                this.text = result;
            }
        }
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.font = "30px KanitLight";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.altText, this.w / 2, -30);

        ctx.restore();
    }
}

class Paragraph {
    constructor(text) {
        this.font = "KanitLight";
        this.maxFontSize = 50;
        this.fontSize = this.maxFontSize;
        this.x = 0;
        this.y = 0;
        this.w = 200;
        this.h = 200;
        this.maxLines = 6;
        this.lines = [];
        this.text = text || "test text";
        this.calculateLines();
    }
    calculateLines() {
        var breaks = ".".repeat(this.maxLines).split("").map((e, i) => ({ lines: this.calculateTextBreakForLineNumber(i + 1) }));
        ctx.font = `1px ${this.font}`;
        for (let o of breaks) {
            o.maxWidth = Math.max(...o.lines.map(e => ctx.measureText(e).width));
            o.maxFontSize = Math.min(this.h / o.lines.length, this.w / o.maxWidth);
        }
        breaks = breaks.sort((a, b) => b.maxFontSize - a.maxFontSize);
        var best = breaks[0];
        this.lines = best.lines;
        this.fontSize = Math.min(best.maxFontSize, this.maxFontSize);
    }
    calculateTextBreakForLineNumber(n) {
        var words = this.text.split(" ");
        var maxCharsPerLine = this.text.length / n;
        var lines = [[]];
        var charCount = 0;
        while (words.length) {
            var word = words.shift();
            lines[lines.length - 1].push(word);
            charCount += word.length + 1;
            if (charCount > maxCharsPerLine) {
                lines.push([]);
                charCount = 0;
            }
        }

        return lines.map(e => e.join(" ")).filter(e => e.length);
    }
    draw() {
        ctx.font = `${this.fontSize}px ${this.font}`;

        var yOffset = (this.h - this.lines.length * this.fontSize) / 2;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        for (var n = 0; n < this.lines.length; n++) {
            var line = this.lines[n];
            ctx.save();
            ctx.translate(0, this.fontSize * n + this.fontSize / 2 + yOffset);
            ctx.fillText(line, this.w / 2, 0);
            ctx.restore();
        }
        //ctx.strokeStyle = "black";
        //ctx.lineWidth = 1;
        //ctx.strokeRect(0, 0, this.w, this.h);
        ctx.restore();
    }
}

class Page {
    constructor() {
    }
    updateEffects() {
    }
    update() {
    }
    draw() {
    }
}

class TitlePage extends Page {
    constructor() {
        super();
        this.playButton = new Button();
        this.playButton.text = "Play";
        this.playButton.w = 200;
        this.playButton.h = 100;
        this.playButton.x = canvas.width / 2 - this.playButton.w / 2;
        this.playButton.y = 300;
    }
    updateEffects() {
        this.playButton.x = canvas.width / 2 - this.playButton.w / 2;
    }
    update() {
        this.updateEffects();
        if (this.playButton.clicked) {
            targetPage = "choose multiplayer or singleplayer";
        }
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "80px KanitLight";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Psych2Learn", 0, 120);

        ctx.restore();

        this.playButton.draw();

        //var p = new Paragraph("A block of long text A block of long text A block of long text A block of long text A block of long text A block of long text ");
        //p.x = 100;
        //p.y = 100;
        //p.w = Mouse.x;
        //p.h = 100;
        //p.calculateLines();
        //p.draw();

        //ctx.drawImage(document.getElementById("crown-image"), 0, 0, 100, 100);
    }
}

class ChooseMultiplayerOrSingleplayerPage extends Page {
    constructor() {
        super();
        this.multiplayerButton = new Button();
        this.multiplayerButton.text = "Multiplayer";
        this.multiplayerButton.w = 350;
        this.multiplayerButton.h = 100;
        this.multiplayerButton.x = canvas.width / 2 - this.multiplayerButton.w / 2;
        this.multiplayerButton.y = 300;

        this.singleplayerButton = new Button();
        this.singleplayerButton.text = "Singleplayer";
        this.singleplayerButton.w = 350;
        this.singleplayerButton.h = 100;
        this.singleplayerButton.x = canvas.width / 2 - this.singleplayerButton.w / 2;
        this.singleplayerButton.y = 500;
    }
    updateEffects() {
        this.multiplayerButton.x = canvas.width / 2 - this.multiplayerButton.w / 2;
        this.singleplayerButton.x = canvas.width / 2 - this.singleplayerButton.w / 2;
    }
    update() {
        this.updateEffects();
        if (this.multiplayerButton.clicked) {
            targetPage = "choose topic multiplayer";
            modality = "multiplayer";
        }
        if (this.singleplayerButton.clicked) {
            targetPage = "choose topic singleplayer";
            modality = "singleplayer";
        }
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px KanitLight";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Choose Multiplayer or Singleplayer", 0, 120);

        ctx.restore();

        this.multiplayerButton.draw();
        this.singleplayerButton.draw();
    }
}

class ChooseTopicSingleplayerPage extends Page {
    constructor() {
        super();
        this.player1ChooseName = new TextInputButton();
        this.player1ChooseName.text = "Player 1";
        this.player1ChooseName.prompt = "Player 1 Name:";
        this.player1ChooseName.altText = "Player 1 Name:";
        this.player1ChooseName.x = canvas.width / 2 - this.player1ChooseName.w / 2;
        this.player1ChooseName.y = 250;

        this.player1ChooseTopic = new TextInputButton();
        this.player1ChooseTopic.text = "Math";
        this.player1ChooseTopic.prompt = "Player 1 Topic:";
        this.player1ChooseTopic.altText = "Player 1 Topic:";
        this.player1ChooseTopic.x = canvas.width / 2 - this.player1ChooseTopic.w / 2;
        this.player1ChooseTopic.y = 420;

        this.startButton = new Button();
        this.startButton.text = "Start!";
        this.startButton.w = 350;
        this.startButton.h = 100;
        this.startButton.x = canvas.width / 2 - this.startButton.w / 2;
        this.startButton.y = 600;
    }
    updateEffects() {
        this.player1ChooseName.x = canvas.width / 2 - this.player1ChooseName.w / 2;
        this.player1ChooseTopic.x = canvas.width / 2 - this.player1ChooseTopic.w / 2;
        this.startButton.x = canvas.width / 2 - this.startButton.w / 2;
    }
    update() {
        this.updateEffects();
        this.player1ChooseName.update();
        this.player1ChooseTopic.update();

        if (this.startButton.clicked) {
            targetPage = "new game";
            topics = [this.player1ChooseTopic.text];
            playerNames = [this.player1ChooseName.text, "Robot Opponent"];
        }
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px KanitLight";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Choose Topic", 0, 120);

        ctx.restore();

        this.player1ChooseName.draw();
        this.player1ChooseTopic.draw();
        this.startButton.draw();
    }
}

class ChooseTopicMultiplayerPage extends Page {
    constructor() {
        super();

        this.player1ChooseName = new TextInputButton();
        this.player1ChooseName.text = "Player 1";
        this.player1ChooseName.prompt = "Player 1 Name:";
        this.player1ChooseName.altText = "Player 1 Name:";
        this.player1ChooseName.x = canvas.width / 2 - this.player1ChooseName.w / 2 - 250;
        this.player1ChooseName.y = 250;

        this.player1ChooseTopic = new TextInputButton();
        this.player1ChooseTopic.text = "Math";
        this.player1ChooseTopic.prompt = "Player 1 Topic:";
        this.player1ChooseTopic.altText = "Player 1 Topic:";
        this.player1ChooseTopic.x = canvas.width / 2 - this.player1ChooseTopic.w / 2 - 250;
        this.player1ChooseTopic.y = 420;

        this.player2ChooseName = new TextInputButton();
        this.player2ChooseName.text = "Player 2";
        this.player2ChooseName.prompt = "Player 2 Name:";
        this.player2ChooseName.altText = "Player 2 Name:";
        this.player2ChooseName.x = canvas.width / 2 - this.player2ChooseName.w / 2 + 250;
        this.player2ChooseName.y = 250;

        this.player2ChooseTopic = new TextInputButton();
        this.player2ChooseTopic.text = "Math";
        this.player2ChooseTopic.prompt = "Player 2 Topic:";
        this.player2ChooseTopic.altText = "Player 2 Topic:";
        this.player2ChooseTopic.x = canvas.width / 2 - this.player2ChooseTopic.w / 2 + 250;
        this.player2ChooseTopic.y = 420;

        this.startButton = new Button();
        this.startButton.text = "Start!";
        this.startButton.w = 350;
        this.startButton.h = 100;
        this.startButton.x = canvas.width / 2 - this.startButton.w / 2;
        this.startButton.y = 600;
    }
    updateEffects() {
        this.player1ChooseName.x = canvas.width / 2 - this.player1ChooseName.w / 2 - 250;
        this.player1ChooseTopic.x = canvas.width / 2 - this.player1ChooseTopic.w / 2 - 250;
        this.player2ChooseName.x = canvas.width / 2 - this.player2ChooseName.w / 2 + 250;
        this.player2ChooseTopic.x = canvas.width / 2 - this.player2ChooseTopic.w / 2 + 250;
        this.startButton.x = canvas.width / 2 - this.startButton.w / 2;
    }
    update() {
        this.updateEffects();
        this.player1ChooseName.update();
        this.player1ChooseTopic.update();
        this.player2ChooseName.update();
        this.player2ChooseTopic.update();

        if (this.startButton.clicked) {
            topics = [this.player1ChooseTopic.text, this.player2ChooseTopic.text];
            playerNames = [this.player1ChooseName.text, this.player2ChooseName.text];
            targetPage = "new game";
        }
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px KanitLight";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Choose Topics", 0, 120);

        ctx.restore();

        this.player1ChooseName.draw();
        this.player1ChooseTopic.draw();
        this.player2ChooseName.draw();
        this.player2ChooseTopic.draw();
        this.startButton.draw();
    }
}