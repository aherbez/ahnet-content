class Keypad extends BaseWidget
{
    constructor( width, height )
    {
        super( width, height );

        this.keySize = this.width / 4;
        this.keySpacing = this.keySize / 4;
        this.totalWidth = ( this.keySize * 3 ) + ( this.keySpacing * 2 );

        this.displaySize = this.height - ( this.keySize * 4 ) - this.keySpacing;

        this.digits = [];
        this.maxDigits = 4;

        this.type = 'KEYPAD';
    }

    _drawKey( ctx, x, y, label )
    {
        ctx.fillStyle = 'rgb(200,200,200)';
        ctx.strokeStyle = 'rgb(40,40,40)';
        ctx.lineWidth = 3;

        ctx.fillRect( x, y, this.keySize, this.keySize );
        ctx.strokeRect( x, y, this.keySize, this.keySize );

        ctx.font = "20px Arial";
        ctx.fillStyle = 'rgb(40,40,40)';
        ctx.textAlign = "center";

        ctx.fillText( label, x + ( this.keySize / 2 ), y + ( this.keySize / 2 ) );
    }

    _drawKeys( ctx )
    {
        let x = 0;
        let y = 0;

        for( let i = 0; i < 9; i++ )
        {
            x = i % 3;
            y = Math.floor( i / 3 );

            let xpos = ( ( this.keySize + this.keySpacing ) * x ) + this.keySpacing;
            let ypos = this.height - ( ( y + 1 ) * ( this.keySize + this.keySpacing ) );

            this._drawKey( ctx, xpos, ypos, "" + ( i + 1 ) );
        }
    }

    _drawDisplay( ctx )
    {
        ctx.save();
        ctx.translate( this.keySpacing, this.keySpacing );

        ctx.fillStyle = "#0E4A18";

        ctx.fillRect( 0, 0, this.width - ( this.keySpacing * 2 ), this.displaySize );

        ctx.strokeStyle = 'rgb(10,10,10)';
        ctx.lineWidth = 5;
        ctx.strokeRect( 0, 0, this.width - ( this.keySpacing * 2 ), this.displaySize );

        let digitText = "";
        for( let i = 0; i < this.digits.length; i++ )
        {
            digitText += this.digits[ i ];
        }
        ctx.restore();

        ctx.save();

        ctx.translate( this.width - this.keySpacing, this.displaySize );

        let fontSize = Math.floor( this.displaySize * 0.75 );

        ctx.font = fontSize + "px Arial";
        ctx.textAlign = "right";
        ctx.fillStyle = 'rgb(0,255,0)';
        ctx.fillText( digitText, 0, 0 );

        ctx.restore();
    }

    render( ctx )
    {
        super.render( ctx );

        ctx.save();
        ctx.translate( this.x, this.y );

        this._drawKeys( ctx );
        this._drawDisplay( ctx );

        ctx.restore();
    }

    mouseDown( clickPos )
    {
        let pos = this._interiorPoint( clickPos );

        if( pos != null )
        {
            let keyClickSize = this.width / 3;

            let minY = this.height - ( keyClickSize * 3 );

            if( pos[ 1 ] >= minY )
            {
                let x = Math.floor( pos[ 0 ] / keyClickSize );
                let y = Math.floor( ( pos[ 1 ] - minY ) / keyClickSize );
                y = 2 - y;

                x++;

                let digit = y * 3 + x;

                if( this.digits.length >= this.maxDigits )
                {
                    this.digits.splice( 0, this.digits.length );
                }
                this.digits.push( digit );

                this.report();
            }

        }
    }

    report()
    {
        let evtData = {};
        evtData.digits = this.digits.slice();
        super.report( evtData );
    }
}