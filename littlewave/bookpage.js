var PAGE_WIDTH = 600;
var PAGE_HEIGHT = 800;
var MAX_WAVE = 100;
var WORD_TIMING = 1000;


function BookPage(ctx)
{
	this.waveLoc = Math.floor(PAGE_WIDTH * 0.8);
	this.waveWidth = 50;
	this.waveHeight = 20;

	this.ctx = ctx;

	this.waveBaseHeight = Math.floor(PAGE_HEIGHT * 0.25);

	this.words = '';
	this.timer = 0;
	// this.redraw();
}

BookPage.prototype.nextPage = null;

BookPage.prototype.activate = function()
{
	this.animating = false;
	this.wordCount = 1;

	this.words = this.pageText.split(' ');
}

BookPage.prototype.pageText = 'It is the duty of the artist to sabotage the familiar. -Andrei Codrescue';

BookPage.prototype.startAnim = function()
{
	this.animating = true;
}

BookPage.prototype.update = function(dt)
{
	this.timer += dt;

	if (this.animating)
	{
		this.waveLoc -= (dt * 0.1);

		if (this.waveLoc < -MAX_WAVE)
		{
			this.waveLoc = Math.floor(PAGE_WIDTH * 1.2);
			
			if (this.nextPage != null)
			{
				alert('NEXT PAGE');
				this.nextPage();
			}
		}
		
	}

	this.redraw();	
}

BookPage.prototype.redraw = function()
{
	this.drawWave();

	this.drawText();
}

BookPage.prototype.drawText = function()
{
	// console.log(this.pageText);

	var maxWord = Math.floor(this.timer / WORD_TIMING);

	if (maxWord > this.words.length)
	{
		maxWord = this.words.length;
	}

	var s = this.words.slice(0, maxWord);
	s = s.join(' ');

	ctx.font = 'bold 20px sans-serif';
	// ctx.fillText(this.pageText, PAGE_WIDTH/2, PAGE_HEIGHT/2);
	ctx.fillText(s, PAGE_WIDTH/10, PAGE_HEIGHT/2);

}

BookPage.prototype.drawWave = function()
{
	var ctx = this.ctx;
	ctx.save();

	ctx.clearRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);

	ctx.strokeStyle = '#000044';
	ctx.fillStyle = '#0000FF';
	//ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);

	var grd = ctx.createLinearGradient(0, 0, 0, PAGE_HEIGHT);
	// light blue
	grd.addColorStop(0, 'rgba(200, 200, 255, 100)'); // '#8ED6FF');   
	// dark blue
	grd.addColorStop(1, 'rgba(0, 0, 255, 255)'); // #004CB3');
	ctx.fillStyle = grd;

	ctx.beginPath();
	ctx.moveTo(PAGE_WIDTH, PAGE_HEIGHT);
	ctx.lineTo(0, PAGE_HEIGHT);
	ctx.lineTo(0, this.waveBaseHeight);

	var newY;
	for (var i=0; i <= PAGE_WIDTH; i++)
	{
		newY = this.waveBaseHeight;

		var offset = this.waveLoc - i;

		// if (offset > (this.waveWidth/2))
		if (i < (this.waveLoc - (this.waveWidth/2)))
		{
			newY += 0;
		}
		else if (i < this.waveLoc)
		{
			offset = offset / (this.waveWidth/2);
			offset = offset * Math.PI;
			offset = Math.cos(offset) + 1;
			offset *= this.waveHeight;

			// var offset = (Math.cos((this.waveLoc - i) / (this.waveWidth/2) * Math.PI) + 0.5) * this.waveHeight;
			// console.log(offset);
			newY -= offset;

		}
		else if ((i - this.waveLoc) < MAX_WAVE)
		{
			offset = offset / (this.waveWidth/2);
			offset = offset * Math.PI;
			offset = Math.cos(offset) + 1;

			var mult = 1 - (i - this.waveLoc)/MAX_WAVE;
			mult = Math.max(0, mult);

			offset *= this.waveHeight;
			offset *= mult;

			// var offset = (Math.cos((this.waveLoc - i) / (this.waveWidth/2) * Math.PI) + 0.5) * this.waveHeight;
			// console.log(offset);
			newY -= offset;

		}
		ctx.lineTo(i, newY);
	}
	ctx.fill();
	ctx.stroke();

	ctx.restore();
}