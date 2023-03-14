var canvas;
var ctx;

var SQUARE_SIZE = 48;

var COLORS = ['#fff', '#f00', '#0f0', '#00f'];
/*
var COLORS = ['#fff', 
				'#ffff06', 
				'#ffff0C', 
				'#ffff12',
				'#ffff18',
				'#ffff1E',
				'#ffff24',
				'#ffff2A',
				'#ffff30',
				'#ffff36',
				'#ffff3C',
				'#ffff40'];
*/
var data;

function init()
{
	canvas = document.getElementById('view');
	ctx = canvas.getContext('2d');

	setupData();

	redraw();
}

function setupData()
{
	data = new Array();

	var currVal = Math.random() * 10;
	// currVal = 0;
	// currVal = 5;

	for (var i=0; i < 400; i++)
	{
		data[i] = currVal;

		currVal += (Math.random() - 0.5) * 0.2;
		
		// currVal += (10/400);
	}

}


function redraw()
{

	ctx.clearRect(0, 0, 700, 700);

	ctx.save();
	ctx.translate(100, 100);

	drawData();
	drawGrid();

	ctx.restore();
	ctx.translate(0, 650);
	drawGraph();
}

function drawGraph()
{
	ctx.strokeStyle = "#000";

	ctx.beginPath();
	ctx.moveTo(0,0);

	var ypos = 0;
	size = 2;
	for (var i=0; i < 400; i++)
	{
		ypos = data[i] * -50;
		ctx.lineTo(i * size, ypos);
	}
	ctx.stroke();

}


function drawData()
{
	var x = 0;
	var y = 0;

	var size = SQUARE_SIZE/2;
	var color;

	var quadrant;
	var quadYear;
	var year;
	var season = 0;

	for (var i=0; i < 400; i++)
	{
		color = Math.floor(data[i] / (10 / COLORS.length));
		if (color < 0) color = 0;
		if (color > COLORS.length) color = COLORS.length - 1;

		year = Math.floor(i / 4);
		season = i % 4;

		quadrant = Math.floor(year / 25);
		quadYear = year % 25;

		ctx.fillStyle = COLORS[color];
		x = (quadrant % 2) * (SQUARE_SIZE * 5);
		y = 0;
		if (quadrant > 1) y = (SQUARE_SIZE * 5);

		// add year offset
		x += (quadYear % 5) * SQUARE_SIZE;
		y += Math.floor(quadYear/5) * SQUARE_SIZE;

		// add in season offset
		x += (season % 2) * (SQUARE_SIZE/2);
		if (season > 1) 
		{
			y += SQUARE_SIZE/2;
		}

		ctx.fillRect(x, y, SQUARE_SIZE/2, SQUARE_SIZE/2);
		console.log(color);

	}

}

function drawGrid()
{

	overallSize = SQUARE_SIZE * 10;
	ctx.save();
	// draw seasonal borders
	ctx.strokeStyle = "#AAA";
	ctx.lineWidth = 1;
	ctx.setLineDash([3,2]);
	ctx.beginPath();

	var seasonSize = SQUARE_SIZE/2;
	for (var i=0; i < 20; i++)
	{
		ctx.moveTo(0, i*seasonSize);
		ctx.lineTo(overallSize, i*seasonSize);
		ctx.moveTo(i*seasonSize, 0);
		ctx.lineTo(i*seasonSize, overallSize);		
	}
	ctx.stroke();
	ctx.closePath();

	ctx.restore();
	// draw year borders
	ctx.strokeStyle = "#777";
	ctx.lineWidth = 3;
	ctx.beginPath();
	for (var i=0; i < 10; i++)
	{
		ctx.moveTo(0, i*SQUARE_SIZE);
		ctx.lineTo(overallSize, i*SQUARE_SIZE);
		ctx.moveTo(i*SQUARE_SIZE, 0);
		ctx.lineTo(i*SQUARE_SIZE, overallSize);		
	}
	ctx.stroke();

	// draw main borders
	ctx.strokeStyle = "#000";
	ctx.lineWidth = 5;
	ctx.strokeRect(0, 0, overallSize, overallSize);

	ctx.beginPath();
	ctx.moveTo(0, overallSize/2);
	ctx.lineTo(overallSize, overallSize/2);
	ctx.moveTo(overallSize/2, 0);
	ctx.lineTo(overallSize/2, overallSize);
	ctx.stroke();

}

init();