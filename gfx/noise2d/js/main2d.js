let canvas = null;
let ctx = null;

let noise = null;
let imgData = null;

let imgSize = 600;
let lastTime = 0;

function init()
{
    canvas = document.getElementById("stage2d");
    ctx = canvas.getContext("2d");

    newNoise();

    update();
}

function newNoise()
{
    noise = new Noise2d(20, 512);
    imgData = noise.toImage(ctx, imgSize);
}

function update(dt)
{
    render();

    // console.log(dt);
    
    requestAnimationFrame(update);
}

function render()
{
    ctx.clearRect(0, 0, 600, 600);
    ctx.putImageData(imgData, (600-imgSize)/2, 0);

}


init();

