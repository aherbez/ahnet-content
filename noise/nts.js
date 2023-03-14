var ctx;
var canvas;
var fps = 1000 / 30;

var canvas_img;
var output_img;

var input;
var output;

var thresehold = 0.15;
var sample_w = 8;
var pix_per_row = 10;

var dragging_thresh = false;

var button;

var show_instructions = true;

function debugOut(txt)
{
	document.getElementById("output").innerHTML = txt;
}

function updateSettings()
{
	var s_width = parseInt(document.getElementById('sample_size').value);
	var img_width = parseInt(document.getElementById('image_width').value);
	
	if (!isNaN(s_width))
	{
		sample_w = s_width;
	}
	if (!isNaN(img_width))
	{
		pix_per_row = img_width;
	}
	
	document.getElementById('sample_size').value = s_width;
	document.getElementById('image_width').value = pix_per_row;
	
	
	updateData();
	// alert('updating to '  + sample_w + ' ' + pix_per_row);
}

function init()
{
	button = document.getElementById('update_settings');
	button.onclick = updateSettings;
	document.getElementById('sample_size').onchange = updateSettings;
	document.getElementById('image_width').onchange = updateSettings;
	
	// alert(msg001);
	canvas = document.getElementById('stage');
	ctx = canvas.getContext('2d');
	
	canvas.onmousedown = handleMouseDown;
	canvas.onmouseup = handleMouseUp;
	canvas.onmousemove = handleMouseMove;
	
	output_img = document.getElementById('output_img').getContext('2d');
	
	input = new Sample();
	input.setFromData(msg002);
	
	/*
	thresehold = 0.15;
	sample_w = 10;
	*/
	
	document.getElementById('sample_size').value = sample_w;
	document.getElementById('image_width').value = pix_per_row;
	
	output = input.convert(thresehold, sample_w);
	
	setInterval(render, fps);
	// render();
}

function updateData()
{
	output = input.convert(thresehold, sample_w);
	render();
	// alert(thresehold);	
}

function render()
{
	ctx.fillStyle = 'rgba(0,0,0,255)';
	ctx.fillRect(0,0,800,600);
	
	renderInput();
	ctx.save();

	ctx.translate(0, 200);
	output.draw(ctx, 180);
	
	ctx.restore();
	
	ctx.fillStyle = 'rgba(255,255,255,255)';
	ctx.fillRect(0, 195, 800, 10);
	
	
	renderOutputImg();
	
	
	if (show_instructions)
	{
		renderInstructions();
	}
}

function renderInstructions()
{
	ctx.fillStyle = 'rgba(255,255,255,255)';
	ctx.fillRect(300,20,420,360);
	ctx.fillStyle = 'rgba(0,0,0,255)';
	
	
	ctx.font = "12pt sans-serif";
	ctx.fillText("INSTRUCTIONS: ", 310, 35);
	for (var i=0; i < instructions.length; i++)
	{
		ctx.fillText(instructions[i], 315, 55 + i*16);
	}
}

function handleMouseDown(evt)
{
	// alert(evt.x + " " + evt.y);
	show_instructions = false;
	
	var x = evt.clientX - 10;
	var y = evt.clientY - 10;
	
	if (x > 20) return;
	
	if (Math.abs(y - (200 * (1-thresehold) ) ) > 20) return;
	
	dragging_thresh = true;
}

function showInstructions()
{
	show_instructions = true;
}

function handleMouseUp(evt)
{
	if (dragging_thresh)
	{
		dragging_thresh = false;
		updateData();
	}
}

function handleMouseMove(evt)
{
	if (dragging_thresh == false) return;
	
	var y = evt.clientY - 10;
	thresehold = 1 - (y/200);
	debugOut(thresehold);
}

function renderInput()
{
	input.draw(ctx, 180);
	drawThresehold();
}

function renderOutputImg()
{
	output_img.fillStyle = 'rgba(128,128,128,255)';
	output_img.fillRect(0,0,200,400);
	
	output_img.save();
	output_img.translate(10,10);
	
	output.renderImage(output_img, pix_per_row);
	
	output_img.restore();
}


function drawThresehold()
{
	var thresh_y = (1-thresehold) * 200;
	ctx.strokeStyle = 'rgba(0,255,0,255)';
	ctx.beginPath();
	ctx.moveTo ( 0, thresh_y);
	ctx.lineTo (800, thresh_y);
	ctx.stroke();
	
	if (dragging_thresh)
	{
		ctx.fillStyle = 'rgba(255,128,128,255)';
	}
	else
	{
		ctx.fillStyle = 'rgba(128,128,128,255)';
	}
	ctx.fillRect(0, thresh_y - 10, 20, 20);
}	



init();