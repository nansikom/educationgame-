class Button {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.borderRadius = 5;
        this.borderWidth = 5;
        this.borderColor = "black";
        this.backgroundColor = "white";
        this.hoverColor = "rgb(230,230,230)";
        this.textColor = "black";
        this.font = "50px Arial";
        this.text = "";
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

        ctx.save();
        ctx.translate(this.w / 2, this.h / 2);
        ctx.font = this.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.textColor;
        ctx.fillText(this.text, 0, 0);
        ctx.restore();

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

        ctx.font = "80px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Education Game", 0, 120);

        ctx.restore();

        this.playButton.draw();
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

        ctx.font = "60px Arial";
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
        let topics = ["Math", "Science", "Trivia"];
        this.buttons = [];
        for (let n = 0; n < topics.length; n++) {
            let button = new Button();
            button.y = 200 + n * 125;
            button.w = 300;
            button.h = 100;
            button.text = topics[n];
            this.buttons.push(button);
        }

        this.startButton = new Button();
        this.startButton.text = "Start";
        this.startButton.w = 350;
        this.startButton.h = 100;
        this.startButton.x = canvas.width / 2 - this.startButton.w / 2;
        this.startButton.y = 600;
    }
    updateEffects() {
        for (let button of this.buttons) {
            button.x = canvas.width / 2 - button.w / 2;
        }

        this.startButton.x = canvas.width / 2 - this.startButton.w / 2;
    }
    update() {
        this.updateEffects();
        for (let button of this.buttons) {
            if (button.clicked) topics[0] = button.text;
        }

        if (this.startButton.clicked) {
            targetPage = "new game";
        }
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Choose Topic (singleplayer)", 0, 120);

        ctx.restore();

        for (let button of this.buttons) {
            button.draw();
        }
        this.startButton.draw();
    }
}

class ChooseTopicMultiplayerPage extends Page {
    constructor() {
        super();
        let topics = ["Math", "Science", "Trivia"];
        this.buttons = [];
        for (let n = 0; n < topics.length; n++) {
            let button = new Button();
            button.y = 200 + n * 125;
            button.w = 300;
            button.h = 100;
            button.player = 1;
            button.text = topics[n];
            this.buttons.push(button);
        }
        for (let n = 0; n < topics.length; n++) {
            let button = new Button();
            button.y = 200 + n * 125;
            button.w = 300;
            button.h = 100;
            button.player = 2;
            button.text = topics[n];
            this.buttons.push(button);
        }

        this.startButton = new Button();
        this.startButton.text = "Start";
        this.startButton.w = 350;
        this.startButton.h = 100;
        this.startButton.x = canvas.width / 2 - this.startButton.w / 2;
        this.startButton.y = 600;
    }
    updateEffects() {
        for (let button of this.buttons) {
            let xOffset;
            if (button.player === 1) {
                xOffset = -200;
            } else if (button.player === 2) {
                xOffset = 200;
            }
            button.x = canvas.width / 2 - button.w / 2 + xOffset;
        }
        this.startButton.x = canvas.width / 2 - this.startButton.w / 2;
    }
    update() {
        this.updateEffects();
        for (let button of this.buttons) {
            if (button.clicked) {
                if (button.player === 1) {
                    topics[0] = button.text;
                } else if (button.player === 2) {
                    topics[1] = button.text;
                }
            }

        }

        if (this.startButton.clicked) {
            targetPage = "new game";
        }
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Choose Topics (multiplayer)", 0, 120);

        ctx.restore();

        for (let button of this.buttons) {
            button.draw();
        }
        this.startButton.draw();
    }
}