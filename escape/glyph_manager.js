/*
 Maintain a list of glyphs and keep track of score
*/
var TIME_VAR    = 30;
var TIME_MIN    = 100;

function GlyphManager(context)
{
    this.glyphs = [];
    this.ctx = context;

    this.next_glyph = Math.floor(Math.random() *  TIME_VAR + TIME_MIN); 
    this.addGlyph();
}


GlyphManager.prototype.update = function()
{
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillRect(180,390,40,10);
    
    this.next_glyph--;
    
    if (this.next_glyph < 0)
    {
        this.next_glyph = Math.floor(Math.random() *  TIME_VAR + TIME_MIN);
        this.addGlyph();  
    }

    output(this.glyphs.length);

    var newglyphs = [];

    for (g in this.glyphs)
    {        
        if (this.glyphs[g].remove == true)
        {
            continue;
        }
        
        this.glyphs[g].update();
        this.glyphs[g].draw(this.ctx);
        newglyphs.push(this.glyphs[g]);
    }
    
    this.glyphs = newglyphs;
};

GlyphManager.prototype.addGlyph = function()
{
    var g = new Glyph();
    this.glyphs.push(g);
};

GlyphManager.prototype.keyPress = function(dir)
{
    for (g in this.glyphs)
    {
        if (this.glyphs[g].active)
        {
            if (this.glyphs[g].g_type == dir)
            {
                this.glyphs[g].passed = true;
            }
        }
    }
};

