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
        return Mouse.x > this.x && Mouse.y > this.y && Mouse.x < this.x + this.w && Mouse.y < this.x + this.h;
    }
    get clicked() {
        return this.hovered && Mouse.click;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.roundRect(0, 0, this.w, this.h, this.borderRadius);
        ctx.fillStyle = this.backgroundColor;
        if(this.hovered) ctx.fillStyle = this.hoverColor;
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