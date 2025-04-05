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
    canvas.onmousemove = function(event) {
        Mouse.x = event.pageX;
        Mouse.y = event.pageY;
    }
    canvas.onmousedown = function(event) {
        Mouse.click = true;
        Mouse.down = true;
    }
    canvas.onmouseup = function(event) {
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

    ctx.fillStyle = "black";
    ctx.fillRect(Mouse.x, Mouse.y, 100, 100);

    var button = new Button();
    button.x = 500;
    button.y = 500;
    button.w = 300;
    button.h = 100;
    button.text = "Hello world";
    button.draw();
    if(button.clicked) console.log("Hello world");

    Mouse.click = false;
}