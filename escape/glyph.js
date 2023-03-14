var TYPE_UP     = 0;
var TYPE_DOWN   = 1;
var START_X     = 500;
var YPOS        = 400;
var TARGET_POS  = 200;
var TARGET_WIDTH = 20;
var ARROW_WIDTH  = 40;

var MOVE_SPEED  = 2;

var img_down    = new Image();
img_down.src    = 'arrow_down.png';
var img_up      = new Image();
img_up.src      = 'arrow_up.png';
var img_passed  = new Image();
img_passed.src  = 'arrow_passed.png';
var img_missed  = new Image();
img_missed.src  = 'arrow_missed.png';

function Glyph()
{
    this.cname = 'Glyph';
    this.reset();
}

Glyph.prototype.reset = function()
{
    this.g_type = Math.floor(Math.random() * 2);
    this.xpos = START_X;
    
    this.passed = false;
    this.active = false;
    this.remove = false;
};

Glyph.prototype.update = function()
{
    this.xpos -= MOVE_SPEED;
    
    this.active = (this.xpos < (TARGET_POS + TARGET_WIDTH/2)) && (this.xpos > (TARGET_POS - TARGET_WIDTH/2 - ARROW_WIDTH));   
    
    //(Math.abs(this.xpos - TARGET_POS) <= TARGET_WIDTH)
    
    if (this.xpos < 0)
    {
        this.remove = true;
    }
};

Glyph.prototype.draw = function(ctx)
{
    ctx.fillRect(TARGET_POS-TARGET_WIDTH/2,YPOS-20,TARGET_WIDTH,20);
    var img = (this.g_type == TYPE_UP) ? img_up : img_down;
    if (this.xpos < (TARGET_POS - TARGET_WIDTH/2))
    {
        img = (this.passed) ? img_passed : img_missed;
    }    
    ctx.drawImage(img, this.xpos, YPOS);
};