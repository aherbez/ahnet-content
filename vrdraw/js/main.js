const WIDTH = 2048;
const HEIGHT = WIDTH/2;

let outputImg = document.getElementById("outputImg");
let canvas = document.getElementById("stage");
let ctx = canvas.getContext('2d');

let testPoint = [-100, 100, 100];

let testPoints = [
    [-10, -10, 10, 'rgb(0, 0, 255)'],
    [-10, 10, 10, 'rgb(0, 0, 255)'],
    [10, 10, 10, 'rgb(0, 0, 255)'],
    [10, -10, 10, 'rgb(0, 0, 255)'],
    [5, -10, 7, 'rgb(0, 0, 255)'],
    [-5, -10, 7, 'rgb(0, 0, 255)'],
    [0, -10, 7, 'rgb(0, 0, 255)'],

    [-10, 10, -10, 'rgb(0, 255, 0)'],
    [-10, 10, 10, 'rgb(0, 255, 0)'],
    [10, 10, 10, 'rgb(0, 255, 0)'],
    [10, 10, -10, 'rgb(0, 255, 0)'],
    [10, 10, -5, 'rgb(0, 255, 0)'],
    [10, 10, 5, 'rgb(0, 255, 0)'],
    [10, 10, 5, 'rgb(0, 255, 0)'],
];


function equiProj(point) {
    let [x, y, z] = point;

    let angle1 = Math.atan2(z, x);
    let angle2 = Math.asin(y / (Math.sqrt(x*x + y*y + z*z)));
    if (isNaN(angle2)) {
        angle2 = 0;
    }
    
    return [angle1, angle2];
}

function remapPoint(p) {
    return [ (p[0]/Math.PI) * (WIDTH/2),
        (p[1]/(Math.PI/2)) * (HEIGHT/2) ];
}

function drawPoint(point) {
    let p = equiProj(point);
    p = remapPoint(p);

    ctx.fillStyle = point[3];
    ctx.beginPath();
    ctx.arc(p[0], p[1], 5, 0, Math.PI*2);
    ctx.fill();
}

function eLineTo(s, e, divs) {
    let p = [0, 0, 0];
    let projPt;

    ctx.beginPath();
    p = s;
    projPt = remapPoint(equiProj(p));
    ctx.moveTo(projPt[0], projPt[1]);

    let u;
    for (let i=0; i < divs; i++) {
        u = i / (divs-1);
        for (let j=0; j < 3; j++) {
            p[j] = (s[j] * (1-u)) + (e[j] * u);
        }
        projPt = remapPoint(equiProj(p));
        ctx.lineTo(projPt[0], projPt[1]);
    }
    ctx.stroke();
}


function drawGridFace(size, divs) {
/*
    eLineTo([-100, -100, 10],
        [100, -100, 10], 500);
    eLineTo([-100, 100, 10],
        [100, 100, 10], 500);    
*/
    let dist = 20;

    let inc;    
    for (let i=0; i < divs; i++) {
        inc = i * ((size*2) / (divs-1));
        
        // front
        ctx.strokeStyle = 'rgb(100, 0, 0)';
        eLineTo([-size, inc-size, dist],[size, inc-size, dist], 500);
        eLineTo([inc-size, -size, dist],[inc-size, size, dist], 500);

        // back
        ctx.strokeStyle = 'rgb(100, 0, 0)';
        eLineTo([-size, inc-size, -dist],[size, inc-size, -dist], 500);
        eLineTo([inc-size, -size, -dist],[inc-size, size, -dist], 500);

        // right
        ctx.strokeStyle = 'rgb(0, 0, 100)';
        eLineTo([dist, inc-size, -size],[dist, inc-size, size], 500);
        eLineTo([dist, -size, inc-size],[dist, size, inc-size], 500);

        // top
        ctx.strokeStyle = 'rgb(0, 100, 0)';
        eLineTo([-size, -dist*2, inc-size],[size, -dist*2, inc-size], 500);
        eLineTo([inc-size, -dist*2, -size],[inc-size, -dist*2, size], 500);


        // bottom
        ctx.strokeStyle = 'rgb(0, 100, 0)';
        eLineTo([-size, dist*2, inc-size],[size, dist*2, inc-size], 500);
        eLineTo([inc-size, dist*2, -size],[inc-size, dist*2, size], 500);
    }
}

function getYpos(theta, x)
{
    // return Math.sin(x);
    return Math.atan(Math.tan(theta) * Math.cos(x));
}

function deg2rad(deg) {
    return (deg/180 * Math.PI);
}

function remap(xin, yin) {
    return [
        (xin / Math.PI) * (WIDTH/2),
        (yin / (Math.PI/2)) * (HEIGHT/2)
    ];
}

function drawHoriz(theta, offset)
{
    // atan(tan(pi * (75/180)) * cos(x))
    ctx.save();

    ctx.beginPath();

    // draw from -Math.PI to Math.PI 
    let divs = 200;
    let delta = (Math.PI * 2) / (divs - 1);

    let plotX, plotY;
    let x, y;
    for (let i=0; i < divs; i++) {
        plotX = -Math.PI + (i * delta);
        plotY = getYpos(deg2rad(theta), plotX+offset);

        [x,y] = remap(plotX, plotY);

        if ( i === 0 ) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        } 
    }
    ctx.stroke();

    ctx.restore();
}

function drawVerticals(angle) {
    ctx.save();
    
    let divs = 360 / angle;
    let delta = WIDTH / divs;

    for (let i=0; i < divs; i++) {
        ctx.beginPath();

        ctx.moveTo(i*delta, 0);
        ctx.lineTo(i*delta, HEIGHT);
        ctx.stroke();
    }

    ctx.restore();
}


function drawGrid(delta)
{   
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = 'rgba(0, 0, 255, 0.15)';

    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);


    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, HEIGHT/2);
    ctx.lineTo(WIDTH, HEIGHT/2);
    ctx.stroke();

    ctx.lineWidth = 1;
    // draw horizontals
    ctx.save();
    ctx.translate(WIDTH/2, HEIGHT/2);

    for (let t = -75; t < 76; t += 15) {
        drawHoriz(t, 0);
        drawHoriz(t, Math.PI/2);
    }
    ctx.restore();

    ctx.lineWidth = 1;
    drawVerticals(15);

    ctx.lineWidth = 3;
    drawVerticals(90);


    outputImg.src = canvas.toDataURL("image/png");
}

drawGrid(ctx);