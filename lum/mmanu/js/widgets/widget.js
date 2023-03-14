class BaseWidget
{
    constructor(w, h)
    {
        this.width = w;
        this.height = h;

        this.baseColor = 'rgb(100,100,100)';
        this.lineColor = 'rgb(0,0,0)';
        this.screwColor = 'rgb(150,150,150)';

        this.x = 0;
        this.y = 0;

        this.id = -1;

        this.type = 'DEFAULT';
    }

    setID( id )
    {
        this.id = id;
    }

    setPos( x, y )
    {
        this.x = x;
        this.y = y;
    }

    _drawScrew( ctx, x, y )
    {
        ctx.fillStyle = this.screwColor;
        ctx.beginPath();
        ctx.arc( x, y, 5, 0, Math.PI * 2 );
        ctx.fill();
    }

    _interiorPoint(pos)
    {
        if( pos[ 0 ] < this.x ) return null;
        if( pos[ 1 ] < this.y ) return null;
        if( pos[ 0 ] > ( this.x + this.width ) ) return null;
        if( pos[ 1 ] > ( this.y + this.height ) ) return null;

        return [pos[0]-this.x, pos[1]-this.y];
    }

    update( dt )
    {
        // abstract
    }

    render( ctx )
    {
        ctx.save();
        ctx.translate( this.x, this.y );
        ctx.fillStyle = this.baseColor;
        ctx.strokeStyle = this.lineColor;
        ctx.fillRect( 0, 0, this.width, this.height );

        this._drawScrew( ctx, 10, 10 );
        this._drawScrew( ctx, this.width-10, 10 );
        this._drawScrew( ctx, this.width-10, this.height-10 );
        this._drawScrew( ctx, 10, this.height-10 );

        ctx.restore();
    }

    mouseDown( clickPos )
    {
        // console.log( "clicked: " + clickPos[0] + ", " + clickPos[1] );
    }

    mouseUp( clickPos )
    {
        // console.log( "clicked: " + clickPos[ 0 ] + ", " + clickPos[ 1 ] );
    }

    report(data)
    {   
        data = data || {};
        data.type = this.type;
        let evt = new CustomEvent( 'action', {bubbles: false, detail: data} );
        document.dispatchEvent( evt );
    }
}

class Buttons extends BaseWidget
{
    constructor( w, h )
    {
        super( w, h );
        this.type = 'BUTTONS';
    }

    render( ctx )
    {
        ctx.save();

        ctx.translate( this.x, this.y );

        ctx.fillStyle = 'rgb(100,200,100)';
        ctx.strokeStyle = 'rgb(0,0,0)';

        ctx.fillRect( 0, 0, this.width, this.height );

        ctx.restore();        
    }
}
