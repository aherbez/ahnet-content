let canvas;
let ctx;
let backingImg;

let canvasX, canvasY;
let canvasWidth, canvasHeight;

let timeToShow = 1;

let player = null;

let rects = [];
let tempRect = null;

class Rect {
    constructor(x, y, w, h, time) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 50;
        this.h = h || 50;
        this.time = time || 0;
    }

    draw(ctx, color) {
        ctx.strokeStyle = color || 'rgb(255, 0, 0)';
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    copy() {
        return new Rect(this.x, this.y, this.w, this.h, this.time);
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
    
    videojs('my-video').ready(() => {
        player = videojs('my-video');
    })

    requestAnimationFrame(render);
}

function clickFn() {
    if (player) {
        player.play();
    }
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
    if (player) {
        player.pause();
    }

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
        if (player) {
            tempRect.time = player.currentTime();
        }
        rects.push(tempRect.copy());
    }
    tempRect = null;

    if (player) {
        player.play();
    }
}


function render() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // ctx.drawImage(backingImg, 0, 0);

    // set color 
    ctx.lineWidth = 3;

    let currTime = player ? player.currentTime() : 0;
    rects.forEach((r) => {
        if (player) {
            let timeDiff = currTime - r.time;
            if (timeDiff >= 0  && timeDiff < timeToShow) {
                r.draw(ctx);
            }
        }
    })


    // console.log(currTime);
    if (tempRect) {
        tempRect.draw(ctx, 'rgb(0, 0, 255)');
    }  

    requestAnimationFrame(render);

}

function drawRects() {
}

init();