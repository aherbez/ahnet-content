let canvas;
let ctx;

const WIDTH = 1000;
const HEIGHT = 300;


function init()
{
	canvas = document.getElementById('stage');
	ctx = canvas.getContext('2d');

	console.log('startup');

	drawDice();
}

function drawDice()
{
	let size = HEIGHT * 0.85;
	let margin = (HEIGHT - size)/2;

	let offset = margin + size;

	for (let i=0; i<3; i++)
	{
		drawDie(i*offset + margin, margin, size);
	}
}

function drawDie(x, y, size)
{
	let dotSizeR = size/8;

	ctx.save();

	ctx.translate(x, y);
	ctx.clearRect(0, 0, WIDTH, HEIGHT);

	ctx.fillStyle = "#000";
	ctx.strokeRect(0, 0, size, size);

	ctx.beginPath();

	let value = Math.floor(Math.random() * 6);
	if (value == 6) value = 5;

	switch (value)
	{
		case 0:
		{
			drawDot(size/2, size/2, dotSizeR);
			break;
		}
		case 1:
		{
			drawDot(size*0.25, size*0.25, dotSizeR);
			drawDot(size*0.75, size*0.75, dotSizeR);
			break;
		}
		case 2:
		{
			drawDot(size/4, size/4, dotSizeR);
			drawDot(size/2, size/2, dotSizeR);			
			drawDot(size*0.75, size*0.75, dotSizeR);
			break;
		}
		case 3:
		{
			drawDot(size*0.25, size*0.25, dotSizeR);
			drawDot(size*0.25, size*0.75, dotSizeR);
			ctx.fill();
			ctx.beginPath();
			drawDot(size*0.75, size*0.75, dotSizeR);
			drawDot(size*0.75, size*0.25, dotSizeR);
			break;
		}
		case 4:
		{
			drawDot(size*0.25, size*0.25, dotSizeR);
			drawDot(size*0.25, size*0.75, dotSizeR);
			ctx.fill();
			ctx.beginPath();
			drawDot(size/2, size/2, dotSizeR);
			ctx.fill();
			ctx.beginPath();
			drawDot(size*0.75, size*0.75, dotSizeR);
			drawDot(size*0.75, size*0.25, dotSizeR);
			break;
		}
		case 5:
		{
			drawDot(size*0.25, size*0.2, dotSizeR);
			drawDot(size*0.25, size*0.5, dotSizeR);
			drawDot(size*0.25, size*0.8, dotSizeR);
			ctx.fill();
			ctx.beginPath();
			drawDot(size*0.75, size*0.2, dotSizeR);
			drawDot(size*0.75, size*0.5, dotSizeR);
			drawDot(size*0.75, size*0.8, dotSizeR);
			break;
		}
		default:
			break;
	}


	ctx.fill();

	ctx.restore();
}

function drawDot(x, y, size)
{
	ctx.arc(x, y, size, 0, Math.PI*2);
}

init();