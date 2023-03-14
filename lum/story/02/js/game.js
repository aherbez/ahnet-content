class Game
{
    constructor( canvasID, width, height )
    {
        this.canvas = document.getElementById( canvasID );
        this.ctx = this.canvas.getContext( "2d" );

        this.width = width;
        this.height = height;

        this.images = new ImageSet( this.ctx );

        this.testRoom = new Room( 8, 7, 24 );
        this.testRoom.setPos( 350, 50 );
        
        this.scroll = new Scroll();
        this.scroll.setPos( 40, 200 );
        
        this.inventory = new Inventory();
        this.inventory.setPos(40, 40);

        requestAnimationFrame( this.update.bind(this) );
    }

    update( dt )
    {
        this.scroll.update( dt );

        this.render(this.ctx);
        requestAnimationFrame( this.update.bind( this ) );
    }

    render(ctx)
    {
        ctx.clearRect( 0, 0, this.width, this.height );

        ctx.save();

        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect( 0, 0, this.width, this.height );

        this.testRoom.render( ctx );

        this.scroll.render( ctx );

        this.inventory.render( ctx );

        ctx.restore();
    }
}