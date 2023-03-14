var PIPES = function()
{
	var WIDTH = 800;
	var HEIGHT = 600;

	var GRID_W;
	var GRID_H;

	var ctx;
	var bounds;

	var pipeSprite;
	var loaded = false;
	var contents = [];
	var pipes = [];
	var drawing = false;

	var currColor = 0;

	var p;

	function loadResources()
	{
		pipeSprite = new Image();
		pipeSprite.src = 'pipe_spr.png';
		pipeSprite.onload = function() {
			loaded = true;
		};
	}

	function init()
	{
		var canvas = document.getElementById('stage');
		ctx = canvas.getContext('2d');
		bounds = canvas.getBoundingClientRect();
		
		loadResources();

		p = new PipeEl(pipeSprite, ctx);
		p.setValue(3);
		p.setColor(3);
		p.setPosition(1, 1);

		GRID_W = Math.ceil(WIDTH/32);
		GRID_H = Math.ceil(HEIGHT/32);

		for (var i=0; i<GRID_H; i++)
		{	
			pipes[i] = [];
			contents[i] = [];
			for (var j=0; j<GRID_W; j++)
			{
				contents[i][j] = false;
				pipes[i][j] = new PipeEl(pipeSprite, ctx);
				pipes[i][j].setValue(0);
				pipes[i][j].setPosition(j, i);
			}
		}

		window.addEventListener('mousedown', mousedown);
		window.addEventListener('mouseup', mouseup);
		window.addEventListener('mousemove', mousemove);

		render();
	}

	function mousedown(event) 
	{
		// console.log('mousedown', event);
		drawing = true;
	}

	function mouseup(event)
	{
		// console.log('mouseup', event);
		drawing = false;
	}

	function mousemove(event)
	{
		// console.log('mousemove', event);
		if (!drawing) return;

		// console.log(event);

		var x = Math.floor((event.clientX - bounds.left)/32);
		var y = Math.floor((event.clientY - bounds.top)/32);

		if (contents[y] !== undefined) contents[y][x] = true;

		updatePipes();
	}

	function updatePipes()
	{
		var value;
		// console.log('UPDATING PIPES!');
		for (var y=0; y<GRID_H; y++)
		{	
			for (var x=0; x<GRID_W; x++)
			{
				value = 0;
				
				if (y < 1 || (contents[y-1] && contents[y-1][x])) value = value | 1;
				if ((y > GRID_H-1) || (contents[y+1] && contents[y+1][x])) value = value | 4;
				
				if (x < 1 || (contents[y] && contents[y][x-1])) value = value | 8;
				if ((x > GRID_W-1) || (contents[y] && contents[y][x+1])) value = value | 2;
				// console.log('value set', value, x, y);
				pipes[y][x].setValue(value);
			}
		}		
	}

	function drawContents()
	{
		ctx.fillStyle = "#222	";

		for (var i=0; i<GRID_H; i++)
		{	
			for (var j=0; j<GRID_W; j++)
			{
				if (contents[i][j])
				{
					ctx.fillRect(j*32, i*32, 32, 32);
				}
			}
		}
	}

	function render()
	{
		ctx.fillStyle = "#111";

		ctx.fillRect(0, 0, 800, 600);

		// p.draw();

		// drawContents();

		for (var i=0; i<GRID_H; i++)
		{	
			for (var j=0; j<GRID_W; j++)
			{
				if (contents[i][j]) pipes[i][j].draw();
			}
		}		

		requestAnimationFrame(render);
	}

	init();
}();