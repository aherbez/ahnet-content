class Helpbutton extends BaseWidget
{
    constructor()
    {
        super(200, 80);
    
        this.type = "HELP";
    }

    mouseDown( clickPos )
    {
        let p = this._interiorPoint( clickPos );
        if( p )
        {
            this.report();
        }
    }

    render( ctx )
    {
        super.render( ctx );

        ctx.save();
        ctx.translate( this.x, this.y );

        ctx.fillStyle = 'rgb(22, 127, 35)';
        ctx.fillRect( 20, 10, this.width - 40, this.height - 20 );

        ctx.fillStyle = 'rgb(41, 232, 65)';
        ctx.font = '25px Arial';
        ctx.textAlign = 'center';

        ctx.fillText( 'BLUEPRINT', this.width / 2, this.height/2 + 10 );


        ctx.restore();
    }

    report()
    {
        super.report( {});
    }
}