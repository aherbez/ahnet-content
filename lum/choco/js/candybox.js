class CandyBox extends Entity
{
    constructor( width, height )
    {
        super();

        this.width = width;
        this.height = height;

        this.boxBack = new ImageEntity( 'img/box_back.png', [ 0.5, 0 ] );
        this.boxBack.setPos( this.width / 2, 0 );
        this.boxBack._setScaleX( (this.width)/1039 );
        this.addChild( this.boxBack );

        this.boxLeft = new ImageEntity( 'img/box_side.png', [ 0, 0 ] );
        this.boxLeft.setPos( 0, 0 );
        this.boxLeft._setScaleY( ( (this.height+60) / 744 ) );
        this.addChild( this.boxLeft );

        this.boxRight = new ImageEntity( 'img/box_side.png', [ 0, 0 ] );
        this.boxRight.setPos( this.width, 0 );
        this.boxRight._setScaleY( ( (this.height+60) / 744 ) );
        this.boxRight._setScaleX( -1 );
        this.addChild( this.boxRight );

        this.boxFront = new ImageEntity( 'img/box_front.png', [ 0.5, 0 ] );
        this.boxFront.setPos( this.width / 2, this.height );
        this.boxFront._setScaleX( ( this.width ) / 1039);
        // this.addChild( this.boxFront );
    }

    render( ctx )
    {
        ctx.fillStyle = 'rgb(248, 214, 220)';
        ctx.fillRect(10, 60, this.width-20, this.height-60);
        // this.renderFront( ctx );
    }

    renderFront(ctx)
    {
        ctx.save();
        ctx.translate( this.pos.x, this.pos.y );
        this.boxFront._render( ctx );
    
        ctx.restore();
    }


}