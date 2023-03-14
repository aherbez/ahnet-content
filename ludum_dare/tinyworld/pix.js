// var TYPE_DIRT = 0;
// var TYPE_WATER = 1;

var PIX_SIZE = 5;

function Pix()
{
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.remove = false;
    this.repel = false;
    
    /*
    if (Math.random() > 0.5)
    {
        this.type = TYPE_WATER;
    }
    else
    {
        this.type = TYPE_DIRT;        
    }
    */
    this.type = TYPE_ROCK;
}

Pix.prototype.setPos = function(_x, _y)
{
    this.x = _x;
    this.y = _y;
}

Pix.prototype.draw = function(ctx)
{
    /*
    switch (this.type)
    {
        case TYPE_DIRT:
            ctx.fillStyle = 'rgb(0,255,0)';
            break;
        case TYPE_WATER:
            ctx.fillStyle = 'rgb(0,0,255)';
            break;
    }
    */
    ctx.fillStyle = TYPE_COLORS[this.type];
    ctx.fillRect(this.x - (PIX_SIZE/2), this.y - (PIX_SIZE/2), PIX_SIZE, PIX_SIZE);
}