var can1, can2, can3, can4, can5;

var ctx1;
var ctx2;
var ctx3;
var ctx4;
var ctx5;

var paint = false;
var card;
var card2;

var STATE_DRAW = 1;
var STATE_ERASE = 2;

var CANVAS_SIZE = 400;

var drawState = STATE_DRAW;
var offscreen;

function init()
{
	offscreen = document.getElementById('offscreen');

	can1 = document.createElement('canvas');	
	can1.width = can1.height = CANVAS_SIZE;
	offscreen.appendChild(can1);

	can2 = document.createElement('canvas');	
	can2.width = can2.height = CANVAS_SIZE;
	offscreen.appendChild(can2);

	can3 = document.createElement('canvas');	
	can3.width = can3.height = CANVAS_SIZE;
	offscreen.appendChild(can3);

	/*
	can4 = document.createElement('canvas');	
	can4.width = can4.height = CANVAS_SIZE;
	document.body.appendChild(can4);
	*/

	//can3 = document.getElementById('canvas3');
	can4 = document.getElementById('canvas4');
	// can5 = document.getElementById('canvas5');

	ctx1 = can1.getContext('2d');
	ctx2 = can2.getContext('2d');
	ctx3 = can3.getContext('2d');
	ctx4 = can4.getContext('2d');
	// ctx5 = can5.getContext('2d');

	document.onmousedown = mouseDown;
	document.onmousemove = mouseMove;
	document.onmouseup = mouseUp;
	document.onkeydown = keyDown;

	card = new Image();
	card2 = new Image();
	card.src = 'cardboard.jpg';
	card2.src = 'card2.jpg';

}

function keyDown(e)
{
	// console.log(e);
	switch (e.keyCode)
	{
		case 32:
		{
			if (drawState == STATE_DRAW) 
			{
				drawState = STATE_ERASE;
			}
			else 
			{
				drawState = STATE_DRAW;
			}
			console.log(drawState);
		}
		break;

		default:
		break;
	}
}

function mouseDown(e)
{
	console.log(e);
	paint = true;
	drawLine(ctx1, e.clientX-10, e.clientY-10, true);
	
}

function testDraw(x, y)
{
	console.log('drawing: ' + x + ' ' + y);
	ctx4.fillStyle = 'rgb(0,0,0)';
	ctx4.fillRect(x-10,y-10,20,20);

}

function mouseMove(e)
{
	// console.log(e);

	if (paint)
	{
		// console.log(e.x-10, e.y-10);
		x = e.clientX - 10;
		y = e.clientY - 10;

		if ((x < 0 || x > CANVAS_SIZE+10) || (y < 10 || y > CANVAS_SIZE+10))
		{
			paint = false;
			return;
		}

		drawLine(ctx1,x,y, false);
		updateComposite();

	}
}

function mouseUp(e)
{
	// console.log(e);
	paint = false;
}

function drawLine(ctx, x, y, start)
{
	ctx.strokeStyle = "rgb(0,0,20)";
	ctx.lineWidth = 20;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	if (start)
	{
		ctx.beginPath();
		ctx.moveTo(x,y);
	}

	if (drawState == STATE_DRAW)
	{	
		ctx.globalCompositeOperation = 'source-over';
		// ctx.strokeStyle = 'rgb(128,128,128,1)';
	}
	else
	{
		ctx.globalCompositeOperation = 'destination-out';
		// ctx.strokeStyle = 'rgb(0,255,0,1)';
	}
	ctx.lineTo(x, y);
	ctx.stroke();
	// updateComposite();
}

function updateComposite()
{
		
	can2.width = can2.width;
	ctx2.globalCompositeOperation = 'source-over';
	ctx2.drawImage(can1, 0, 0);
	ctx2.globalCompositeOperation = 'source-atop';
	ctx2.drawImage(card2, 0, 0);
	
	can3.width = can3.width;
	ctx3.globalCompositeOperation = 'source-over';
	ctx3.drawImage(can1, 0, 0);
	ctx3.globalCompositeOperation = 'source-atop';
	ctx3.drawImage(card, 0, 0);

	// combine two images
	can4.width = can4.width;
	ctx4.globalCompositeOperation = 'source-over';
	ctx4.drawImage(can2, -5, -5);
	ctx4.globalCompositeOperation = 'source-over';
	ctx4.drawImage(can3, 0, 0);
	
}


init();


