class Player extends Entity
{
    constructor()
    {
        super();

        this.srcImage = new Image();
        this.srcImage.src = 'img/StoryTimeItemSprites.png';

        this.offsetX = 4;
        this.offsetY = 4;
        this.gridSize = 40;

    }

    update( dt )
    {

    }

    render( ctx )
    {
        ctx.drawImage( this.srcImage, ( this.offsetX * this.gridSize ), ( this.offsetY * this.gridSize ), this.gridSize, this.gridSize,
            5, 5, this.gridSize, this.gridSize );
    }
}