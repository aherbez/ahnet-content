var SAMPLE_SIZE = 8000;
var SIGNAL_ANALOG = 1;
var SIGNAL_DIGITAL = 2;
var HIGH_RATIO = 0.6;

var IMAGE_WIDTH = 180;

function Sample(size)
{
	this.data = new Array();
	this.size = size || SAMPLE_SIZE;
	
	this.type = SIGNAL_ANALOG;
	this.sample_w = -1;
}

function AnalogSample(size)
{
	this.type = SIGNAL_ANALOG;
	this.data = new Array();
	this.size = size || SAMPLE_SIZE;
}

function DigitalSample()
{
	this.type = SIGNAL_DIGITAL;
	this.data = new Array();
}

Sample.prototype.setFromData = function(_data)
{
	this.data = null;
	this.data = new Array();
	
	this.size = _data.length;
	
	for (var i=0; i < _data.length; i++)
	{
		this.data[i] = _data[i];
	}
	
}
/*
Sample.prototype.setFromURL = function(_url)
{
	this.type = SIGNAL_ANALOG;
	
	$.ajax({
		url: _url,
		context: this,
		dataType: "json"
	}).done(function(_data) { 
		// $(this).addClass("done");
		this.data = _data;10                                                                                                                                                                        10
		// alert(this.data);
	});
}
*/
Sample.prototype.random = function()
{
	this.data = new Array();
	
	for (var i =0; i< this.size; i++)
	{
		this.data[i] = Math.random();
	}
}

Sample.prototype.draw = function(ctx, height)
{
	ctx.strokeStyle = 'rgba(0,0,255,255)';
	ctx.beginPath();
	ctx.moveTo(0, height/2);
	
	if (this.type == SIGNAL_ANALOG)
	{	
		for (var i=0; i< this.size; i++)
		{
			ctx.lineTo( i, (1-this.data[i]) * height);
		}
	}
	else
	{
		for (var i=0; i < this.data.length; i++)
		{
			if (this.data[i] == 1)
			{
				ctx.lineTo( i * this.sample_w, (height * 0.25));
				ctx.lineTo( (i+1) * this.sample_w, (height * 0.25));
			}
			else
			{
				ctx.lineTo( i * this.sample_w, (height * 0.75));
				ctx.lineTo( (i+1) * this.sample_w, (height * 0.75));
				
			}
		}
	}
	ctx.stroke();
}

Sample.prototype.convert = function (thresehold, sample_w)
{
	var output = new Sample(this.size);
	output.type = SIGNAL_DIGITAL;
	output.sample_w = sample_w;
	
	var count=0;
	var num_high = 0;
	
	var k=0;
	for (var i=0; i< this.size; i++)
	{
		count++;

		if (this.data[i] >= thresehold)
		{
			num_high++;
		}
		
		if (count == sample_w)
		{
			count = 0;
			
			var high = false;
			if ((num_high / sample_w) >= HIGH_RATIO)
			{                                                                                                                                                                              
				high = true;
				output.data[k] = 1;
			}
			else
			{
				output.data[k] = 0;
			}
			
			k++;
			
			/*
			for (var j=sample_w; j > 0; j--)
			{
				if (high)
				{
					output.data[i - j] = 0.75;
				}
				else
				{
					output.data[i-j] = 0.25;
				}
			}
			*/
			
			num_high = 0;	
		}
	}
	output.size = Math.ceil(this.size / sample_w);
	
	// alert(output.data);
	return output;
}

Sample.prototype.renderImage = function (ctx, pix_per_row)
{
	if (this.type != SIGNAL_DIGITAL) 
	{                                                                                                                                                                                                              

		return;
	}                                                                                                                                                                                                                                                                                                                                                                                   10

	
	var pix_width = Math.floor(IMAGE_WIDTH / pix_per_row);
	
	var x, y;
	
	ctx.strokeStyle = 'rgba(0,0,0,255)';
	for (var i=0; i < this.size; i++)
	{
		x = i % pix_per_row;
		y = Math.floor(i / pix_per_row);
		
		if (this.data[i] == 1)
		{
			ctx.fillStyle = 'rgba(0,0,0,255)';
		}
		else
		{
			ctx.fillStyle = 'rgba(255,255,255,255)';
		}
		
		ctx.fillRect( x * pix_width, y*pix_width, pix_width, pix_width);
		ctx.strokeRect( x * pix_width, y*pix_width, pix_width, pix_width);
	}
	
}