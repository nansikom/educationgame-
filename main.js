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

    if (targetPage == "new game") {
        targetPage = "game";
        game = new Game(modality);
        game.requestQuestionGeneration(topics);
    }
    if (targetPage != page) {
        pageTransition++;
        if (pageTransition == 30) {
            pageTransition = 0;
            page = targetPage;
            pageTransitionBackwards = false;
        }
        updatePageEffects(page);
        updatePageEffects(targetPage);
        ctx.save();
        var a = easeInOut(pageTransition / 30);
        if(pageTransitionBackwards) {
            ctx.translate(0, canvas.height * a);
        } else {
            ctx.translate(0, -canvas.height * a);
        }
        drawPage(page);
        if(pageTransitionBackwards) {
            ctx.translate(0, -canvas.height);
        } else {
            ctx.translate(0, canvas.height);
        }
        drawPage(targetPage);
        ctx.restore();
    } else {
        updatePage(page);
        drawPage(page);
    }

    Mouse.click = false;
}

function drawPage(p) {
    if (p == "title page") {
        titlePage.draw();
    } else if (p == "choose multiplayer or singleplayer") {
        chooseMultiplayerOrSingleplayerPage.draw();
    } else if (p == "choose topic singleplayer") {
        chooseTopicSingleplayerPage.draw();
    } else if (p == "choose topic multiplayer") {
        chooseTopicMultiplayerPage.draw();
    } else if (p == "game") {
        game.draw();
    }
}

function updatePageEffects(p) {
    if (p == "title page") {
        titlePage.updateEffects();
    } else if (p == "choose multiplayer or singleplayer") {
        chooseMultiplayerOrSingleplayerPage.updateEffects();
    } else if (p == "choose topic singleplayer") {
        chooseTopicSingleplayerPage.updateEffects();
    } else if (p == "choose topic multiplayer") {
        chooseTopicMultiplayerPage.updateEffects();
    } else if (p == "game") {
        game.updateEffects();
    }
}

function updatePage(p) {
    if (p == "title page") {
        titlePage.update();
    } else if (p == "choose multiplayer or singleplayer") {
        chooseMultiplayerOrSingleplayerPage.update();
    } else if (p == "choose topic singleplayer") {
        chooseTopicSingleplayerPage.update();
    } else if (p == "choose topic multiplayer") {
        chooseTopicMultiplayerPage.update();
    } else if (p == "game") {
        game.update();
    }
}

let page = "title page";
let targetPage = "title page";
let pageTransition = 0;
let pageTransitionBackwards = false;
let modality = false;
let topics = [];
let titlePage = new TitlePage();
let chooseMultiplayerOrSingleplayerPage = new ChooseMultiplayerOrSingleplayerPage();
let chooseTopicSingleplayerPage = new ChooseTopicSingleplayerPage();
let chooseTopicMultiplayerPage = new ChooseTopicMultiplayerPage();
let game = false;