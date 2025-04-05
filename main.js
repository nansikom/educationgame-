let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let Mouse = {};

window.onload = function () {
    window.onresize = resizeCanvas;
    resizeCanvas();

    window.setInterval(main, 10);

    canvas.clear = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctx.roundRect = (x, y, w, h, r, b) => {
        if (!b) ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
        ctx.lineTo(x + w, y + h - r);
        ctx.arc(x + w - r, y + h - r, r, 0 * Math.PI, 0.5 * Math.PI);
        ctx.lineTo(x + r, y + h);
        ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
        ctx.lineTo(x, y + r);
        ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
    }
    canvas.onmousemove = function (event) {
        Mouse.x = event.pageX;
        Mouse.y = event.pageY;
    }
    canvas.onmousedown = function (event) {
        Mouse.click = true;
        Mouse.down = true;
    }
    canvas.onmouseup = function (event) {
        Mouse.down = false;
    }
    Mouse = {
        x: 0,
        y: 0,
        click: false,
        down: false
    }
}

function resizeCanvas() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function main() {
    canvas.clear();

    if (page == "title page") {
        titlePage.update();
        titlePage.draw();
    } else if (page == "choose multiplayer or singleplayer") {
        chooseMultiplayerOrSingleplayerPage.update();
        chooseMultiplayerOrSingleplayerPage.draw();
    } else if (page == "choose topic singleplayer") {
        chooseTopicSingleplayerPage.update();
        chooseTopicSingleplayerPage.draw();
    } else if (page == "choose topic multiplayer") {
        chooseTopicMultiplayerPage.update();
        chooseTopicMultiplayerPage.draw();
    } else if (page == "new game") {
        game = new Game(topics, modality);
        page = "game";
    } else if (page == "game") {
        game.update();
        game.draw();
    }

    Mouse.click = false;
}

let page = "title page";
let modality = false;
let topics = [];
let titlePage = new TitlePage();
let chooseMultiplayerOrSingleplayerPage = new ChooseMultiplayerOrSingleplayerPage();
let chooseTopicSingleplayerPage = new ChooseTopicSingleplayerPage();
let chooseTopicMultiplayerPage = new ChooseTopicMultiplayerPage();
let game = false;