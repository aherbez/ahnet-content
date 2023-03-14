let canvas;
let ctx;
let backingImg;

let canvasX, canvasY;
let canvasWidth, canvasHeight;

let timeToShow = 1;

let player = null;

let rects = [];
let tempRect = null;

let animationCounter = 0;
let ANIMATION_TIME_MS = 1 * 1000;
let lastTime = Date.now();

let animating = false;

let playingVideo = false;

let leftImg, rightImg, bowImg;

function init() {
    canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d');

    let bounds = canvas.getBoundingClientRect();
    canvasX = bounds.x;
    canvasY = bounds.y;
    canvasWidth = 540; // bounds.width;
    canvasHeight = 720; // bounds.height;

    // only start drawing on the image
    canvas.onmousedown = mouseDown;
    // but account for movement / mouseup outside of it
    document.onmousemove = mouseMove;
    document.onmouseup = mouseUp;

    window.addEventListener('touchstart', function() {
        animating = true;
    });

    leftImg = new Image();
    leftImg.src = './left.png';

    rightImg = new Image();
    rightImg.src = './right.png';

    bowImg = new Image();
    bowImg.src = './bow.png';
        
    videojs('my-video').ready(() => {
        player = videojs('my-video');
    })

    requestAnimationFrame(render);
}

function mouseDown(evt) {
    if (player) {
        player.pause();
    }
}

function mouseMove(evt) {
    if (tempRect !== null) {
        let currPos = cleanPos(evt);

        tempRect.w = currPos.x - tempRect.x;
        tempRect.h = currPos.y - tempRect.y;
    }
}

function mouseUp(evt) {
    animating = true;
}

function render() {
    let current = Date.now();
    let deltaTime = (current - lastTime);
    lastTime = current;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
   //  ctx.fillReact(0, 0, canvasWidth, canvasHeight);

    if (animating) {
        animationCounter += deltaTime;
    }
    
    let animationVal = (animationCounter / ANIMATION_TIME_MS);
    if (animationVal >= 1) {
        if (!playingVideo) {
            if (player) {
                player.play();
            }
            playingVideo = true;
        }
    }
    let s = 1.5; // (canvasWidth/2) / 180;
    console.log(s);
    // ctx.save();
    // ctx.scale(s,s);

    ctx.save();
    ctx.translate((animationVal * -(canvasWidth/2)),0);
    ctx.scale(1.5,1.5);
    // ctx.translate(animationVal * -180, 0);
    ctx.drawImage(leftImg, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate((animationVal * (canvasWidth/2)), 0);
    ctx.scale(1.5,1.5);
    // ctx.translate(animationVal * 180, 0);
    ctx.drawImage(rightImg, 180, 0);
    ctx.restore();

    ctx.save();
    ctx.translate((animationVal * (canvasWidth/2)) + (canvasWidth/2), canvasHeight/2);
    ctx.rotate((animationVal * Math.PI/2));
    ctx.save();
    ctx.translate(-80, -60);
    ctx.drawImage(bowImg, 0, 0);
    ctx.restore();
    ctx.restore();
    
    // ctx.restore();

    requestAnimationFrame(render);
}

init();