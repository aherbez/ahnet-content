let canvas;
let ctx;
let dieVals = [];

const WIDTH = 900;
const HEIGHT = 900;

let isTriple = false;
let hasDouble = false;

function init()
{
	canvas = document.getElementById('stage');
	ctx = canvas.getContext('2d');
	
	setVals();
	drawDice();
	drawOptions();

	ctx.strokeRect(10, 350, 600, 300);
}

function setVals()
{
	for (let i=0; i<3; i++)
	{
		dieVals[i] = Math.floor(Math.random() * 6);
		if (dieVals[i] == 6) dieVals[i] = 5;
	}	

	dieVals.sort();

	isTriple = (dieVals[0] == dieVals[1]) && (dieVals[1] == dieVals[2]);
	hasDouble = (dieVals[0] == dieVals[1]) || (dieVals[1] == dieVals[2]);
}

function drawDice()
{

	let size = HEIGHT;
	let margin = (HEIGHT - size)/2;
	margin = 20;
	size = (WIDTH - (margin * 4)) / 3;
	size = WIDTH/3;

	let offset = margin + size;

	for (let i=0; i<3; i++)
	{
		drawDie(i*offset + margin*1.5, margin, size, dieVals[i]);
	}

}

function drawOptions()
{

	ctx.font = '50px arial';
	ctx.textAlign = 'left';
	ctx.fillText('OPTIONS:', 20, 400);
	ctx.fillStyle = "#000";

	let direction, distance;


	if (isTriple)
	{
		ctx.font = '50px arial';
		ctx.fillStyle = "#D00";
		ctx.textAlign = 'left';

		ctx.fillText('FREE JUMP!!!!', 20, 450);

	}
	else if (hasDouble)
	{
		if (dieVals[0] == dieVals[1])
		{
			direction = dieVals[2]+1;
			distance = dieVals[0]+1;
			console.log(distance + " steps in direction " + direction);
			
			ctx.save();
			ctx.translate(100, 500);
			drawMoveOption(direction, distance);
			ctx.restore();

			direction = dieVals[0]+1;
			distance = dieVals[2]+1;
			console.log(distance + " steps in direction " + direction);
			
			ctx.save();
			ctx.translate(300, 500);
			drawMoveOption(direction, distance);
			ctx.restore();

		}
		else
		{
			// dieVals[1] == dieVals[2]
			direction = dieVals[0]+1;
			distance = dieVals[1]+1;
			console.log(distance + " steps in direction " + direction);
			
			ctx.save();
			ctx.translate(100, 500);
			drawMoveOption(direction, distance);
			ctx.restore();

			direction = dieVals[1]+1;
			distance = dieVals[0]+1;
			console.log(distance + " steps in direction " + direction);
			
			ctx.save();
			ctx.translate(300, 500);
			drawMoveOption(direction, distance);
			ctx.restore();

		}
	}
	else 
	{
		for (let i=0; i<3; i++)
		{
			let direction = dieVals[i]+1;
			let distance = Math.abs((dieVals[(i+1)%3]+1) - (dieVals[(i+2)%3]+1));
			console.log(distance + " steps in direction " + direction);
			
			ctx.save();
			ctx.translate(200* i+ 100, 500);
			drawMoveOption(direction, distance);
			ctx.restore();
		}

	}

}

function drawHexagon(r)
{
	let x = r;
	let y = 0;
	let angle = 0;

	ctx.beginPath();
	ctx.moveTo(x, y);

	for (let i=1; i<6; i++)
	{
		angle = (Math.PI * 2)/6.0 * i;
		x = Math.cos(angle) * r;
		y = Math.sin(angle) * r;
		ctx.lineTo(x, y);
	}
	ctx.lineTo(r, 0);
	ctx.stroke();
}

function drawArrow(direction, length, height)
{

	let slice = (Math.PI * 2) / 6;
	let angle = slice * (direction) - (slice * 2.5);

	ctx.save();
	ctx.rotate(angle);
	ctx.fillStyle = "#F00";
	
	ctx.beginPath();
	ctx.moveTo(0, (height * -0.45));
	ctx.lineTo(length * 0.8, (height * -0.45));
	ctx.lineTo(length * 0.8, -height);
	ctx.lineTo(length, 0);
	ctx.lineTo(length * 0.8, height);
	ctx.lineTo(length * 0.8, height * 0.45);
	ctx.lineTo(0, height * 0.45);
	ctx.moveTo(0, (height * -0.45));
	ctx.fill();

	ctx.fillStyle = "#000";
	ctx.restore();
}

function drawMoveOption(direction, distance)
{

	drawHexagon(50);
	drawArrow(direction, 60, 20);
	ctx.textAlign = "center";
	ctx.font = '30px arial';
	ctx.fillStyle = "#000";
	ctx.fillText(''+distance, 0, 70);
}

function drawDie(x, y, size, value)
{
	let dotSizeR = size/8;

	ctx.save();

	ctx.translate(x, y);
	ctx.clearRect(0, 0, WIDTH, HEIGHT);

	ctx.fillStyle = "#000";
	ctx.strokeRect(0, 0, size, size);

	ctx.beginPath();

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