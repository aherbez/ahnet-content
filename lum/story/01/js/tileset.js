class Tileset
{
    constructor( imageSrc, gridSize )
    {
        this.image = new Image();
        this.image.src = imageSrc;

        this.gridSize = gridSize;

        this.tileLookup = {};
    }

    setTile( name, xpos, ypos )
    {
        this.tileLookup[ name ] = {
            x: xpos,
            y: ypos
        };    
    }

    drawTile(name, x, y, ctx)
    {
        // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

        if( !this.tileLookup.hasOwnProperty( name ) || !this.image )
        {
            return;
        }

        let tile = this.tileLookup[ name ];
        // console.log( tile );
        ctx.drawImage( this.image, tile.x * this.gridSize, tile.y * this.gridSize,
            this.gridSize, this.gridSize,
            x, y, this.gridSize, this.gridSize);

    }

}