var PipeEl = function(img, context) {
	this.img = img;
	this.ctx = context;
	this.color = 0;

	this.value = 0;

	this.xOffset = 0;
	this.yOffset = 0;

	this.x = 0;
	this.y = 0;

};

PipeEl.prototype.setPosition = function(x, y) 
{
	this.x = x;
	this.y = y;
}

/*

-1-
8-2
-4-

*/

PipeEl.prototype.setOffsets = function()
{
	var x, y;
	// console.log('value: ', this.value);
	switch (this.value)
	{
		// vertical
		case 5:
			x = 3;
			y = 2;
			break;

		// horizontal
		case 10:
			x = 3;
			y = 1;
			break;

		// T-junctions
		case 15:
			x = 0;
			y = 0;
			break;
		case 11:
			x = 2;
			y = 4;
			break;
		case 7:
			x = 1;
			y = 4;
			break;
		case 12:
			x = 2;
			y = 1;
			break;
		case 13:
			x = 2;
			y = 3;
			break;
		case 14:
			x = 1;
			y = 3;
			break;

		// L-junctions
		case 3:
			x = 1;
			y = 2;
			break;
		case 6:
			x = 1;
			y = 1;
			break;
		case 12:
			x = 2;
			y = 1;
			break;
		case 9:
			x = 2;
			y = 2;
			break;
	}

	// this.xOffset = x;
	// this.yOffset = y;
	// console.log(x, y);	
	return {x: x, y: y};
}

PipeEl.prototype.setColor = function(c)
{
	this.color = c;
}

PipeEl.prototype.setValue = function(v)
{
	
	// console.log(v);
	this.value = v;
	var off = this.setOffsets();
	// console.log('off: ', off);
	this.xOffset = off.x;
	this.yOffset = off.y;
}

PipeEl.prototype.drawPiece = function(v, c)
{
	if (v < 1) return;

	var offX = this.xOffset;
	var offY = this.yOffset;

	offX += (c % 3) * 4;
	offY += Math.floor(c/3) * 5;

	this.ctx.drawImage(this.img, offX*32, offY*32, 32, 32, this.x*32, this.y*32, 32, 32);

}

PipeEl.prototype.draw = function()
{
	if (this.value < 1) return;

	var offX = this.xOffset;
	var offY = this.yOffset;

	offX += (this.color % 3) * 4;
	offY += Math.floor(this.color/3) * 5;

	this.ctx.drawImage(this.img, offX*32, offY*32, 32, 32, this.x*32, this.y*32, 32, 32);

}