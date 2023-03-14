class ButtonPanel extends BaseWidget
{
    constructor( numW, numH, buttonSize )
    {
        let spacing = 20;
        let totalWidth = ( buttonSize + spacing ) * numW;
        let totalHeight = ( buttonSize + spacing ) * ( numH * 2 );
        super( totalWidth, totalHeight );

        this.buttonSize = buttonSize;
        this.spacing = spacing;
        this.numW = numW;
        this.numH = numH;

        this.buttonStates = [];
        for( let i = 0; i < ( numW * numH ); i++ )
        {
            this.buttonStates[ i ] = 0;
        }

        this.bottomColor = 'rgb(122, 20, 59)';
        this.buttonColor = 'rgb(173, 27, 83)';

        this.type = 'BUTTONPANEL';

    }

    _drawButton( ctx, index )
    {
        ctx.save();
        ctx.strokeStyle = 'rgb(0,0,0)';

        ctx.strokeRect( 0, 0, this.buttonSize, this.buttonSize * 2 );

        let height = this.buttonStates[ index ] ? 2 : 10;

        ctx.save();
        ctx.translate(this.buttonSize * 0.1, this.buttonSize * 1.1);


        ctx.fillStyle = this.bottomColor;
        // ctx.fillRect(0,0,this.buttonSize * 0.8, this.buttonSize * 0.8);
        ctx.beginPath();
        ctx.moveTo( 0, 0 );
        ctx.lineTo( this.buttonSize * 0.1, -height );
        ctx.lineTo( this.buttonSize * 0.7, -height );
        ctx.lineTo( this.buttonSize * 0.8, 0 );
        ctx.lineTo( this.buttonSize * 0.8, this.buttonSize * 0.8 );
        ctx.lineTo( 0, this.buttonSize * 0.8 );
        ctx.lineTo( 0, 0 );
        ctx.fill();

        ctx.fillStyle = this.buttonColor;
        ctx.fillRect(this.buttonSize*0.1, -height, this.buttonSize * 0.6, this.buttonSize * 0.6);
        
        ctx.restore();

        // draw LED
        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.beginPath();
        ctx.arc( this.buttonSize * 0.5, this.buttonSize * 0.5, this.buttonSize * 0.25, 0, Math.PI * 2 );
        ctx.fill();

        ctx.fillStyle = this.buttonStates[index] ? 'rgb(255, 0, 0)' : 'rgb(100, 0, 0)';
        ctx.beginPath();
        ctx.arc( this.buttonSize * 0.5, this.buttonSize * 0.5, this.buttonSize * 0.2, 0, Math.PI * 2 );
        ctx.fill();


        ctx.restore();
    }

    mouseDown( clickPos )
    {
        let p = this._interiorPoint( clickPos );
        if( p )
        {
            let x = Math.floor( p[ 0 ] / ( this.width / this.numW ) );
            let y = Math.floor( p[ 1 ] / ( this.height / this.numH ) );

            let index = ( y * this.numW ) + x;
            this.buttonStates[ index ] = (this.buttonStates[ index ] + 1) % 2;
            this.report();
        }
    }

    render( ctx )
    {
        super.render( ctx );
        ctx.save();

        ctx.translate( this.x, this.y );

        let x = 0;
        let y = 0;
        for( let i = 0; i < this.buttonStates.length; i++ )
        {
            x = i % this.numW;
            y = Math.floor( i / this.numW );
            ctx.save();

            ctx.translate(
                ( x * ( this.buttonSize + this.spacing ) + this.spacing / 2 ),
                ( y * ( this.buttonSize * 2 + this.spacing ) + this.spacing * 1.5 )
            );

            this._drawButton( ctx, i );

            ctx.restore();
        }

        ctx.restore();
    }

    report()
    {
        let data = {};
        data.buttonstates = this.buttonStates.slice();
        super.report( data );
    }
}