/*
 Maintain a list of glyphs and keep track of score
*/
var TIME_VAR    = 30;
var TIME_MIN    = 10;

function GlyphManager(context)
{
    this.glyphs = [];
    this.ctx = context;

    this.next_glyph = Math.floor(Math.random() *  TIME_VAR + TIME_MIN); 
}

GlyphManager.prototype.update = function()
{
    this.next_glyph--;
    
    if (this.next_glyph < 0)
    {
        this.next_glyph = Math.floor(Math.random() *  TIME_VAR + TIME_MIN);
        this.addGlyph();  
    }
    
    for (var g in this.glyphs)
    {
        g.update();
        g.draw(this.ctx);
    }
};

GlyphManager.prototype.addGlyph = function()
{
    var g = new Glyph();
    this.glyphs.push(g);
};

