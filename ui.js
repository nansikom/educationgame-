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
    update() {
        this.playButton.x = canvas.width / 2 - this.playButton.w / 2;

        if (this.playButton.clicked) {
            page = "choose multiplayer or singleplayer";
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
    update() {
        this.multiplayerButton.x = canvas.width / 2 - this.multiplayerButton.w / 2;
        this.singleplayerButton.x = canvas.width / 2 - this.singleplayerButton.w / 2;

        if(this.multiplayerButton.clicked) {
            page = "choose topic multiplayer";
        }
        if(this.singleplayerButton.clicked) {
            page = "choose topic singleplayer";
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
    update() {
        this.multiplayerButton.x = canvas.width / 2 - this.multiplayerButton.w / 2;
        this.singleplayerButton.x = canvas.width / 2 - this.singleplayerButton.w / 2;
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Choose Topic (singleplayer)", 0, 120);

        ctx.restore();

        this.multiplayerButton.draw();
        this.singleplayerButton.draw();
    }
}

class ChooseTopicMultiplayerPage extends Page {
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
    update() {
        this.multiplayerButton.x = canvas.width / 2 - this.multiplayerButton.w / 2;
        this.singleplayerButton.x = canvas.width / 2 - this.singleplayerButton.w / 2;
    }
    draw() {
        ctx.save();
        ctx.translate(canvas.width / 2, 0);

        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Choose Topics (multiplayer)", 0, 120);

        ctx.restore();

        this.multiplayerButton.draw();
        this.singleplayerButton.draw();
    }
}