let canvas;
let ctx;
let backingImg;

let canvasX, canvasY;
let canvasWidth, canvasHeight;

let rects = [];
let tempRect = null;

class Rect {
    constructor(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 50;
        this.h = h || 50;
    }

    draw(ctx, color) {
        ctx.strokeStyle = color || 'rgb(255, 0, 0)';
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    copy() {
        return new Rect(this.x, this.y, this.w, this.h);
    }
}

function init() {
    canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d');

    let bounds = canvas.getBoundingClientRect();
    canvasX = bounds.x;
    canvasY = bounds.y;
    canvasWidth = bounds.width;
    canvasHeight = bounds.height;

    // only start drawing on the image
    canvas.onmousedown = mouseDown;
    // but account for movement / mouseup outside of it
    document.onmousemove = mouseMove;
    document.onmouseup = mouseUp;
    
    backingImg = new Image();
    backingImg.onload = render;
    backingImg.src = "milky-way.jpg";
    
    requestAnimationFrame(render);
}

function cleanPos(evt) {
    let x = evt.clientX - canvasX;
    let y = evt.clientY - canvasY;

    return {
        x: Math.min(x, canvasWidth),
        y: Math.min(y, canvasHeight)
    };
}

function mouseDown(evt) {
    let startPos = cleanPos(evt);
    tempRect = new Rect(startPos.x, startPos.y, 1, 1);
}

function mouseMove(evt) {
    if (tempRect !== null) {
        let currPos = cleanPos(evt);

        tempRect.w = currPos.x - tempRect.x;
        tempRect.h = currPos.y - tempRect.y;
    }
}

function mouseUp(evt) {
    if (tempRect) {
        rects.push(tempRect.copy());

    }

    tempRect = null;
}


function render() {
    ctx.clearRect(0, 0, 800, 600);
    ctx.drawImage(backingImg, 0, 0);

    // set color 
    ctx.lineWidth = 3;

    rects.forEach((r) => {
        r.draw(ctx);
    })

    if (tempRect) {
        tempRect.draw(ctx, 'rgb(0, 0, 255)');
    }  

    requestAnimationFrame(render);

}

function drawRects() {
}

init();