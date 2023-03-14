class BigButton extends BaseWidget
{
    constructor(size, spacing)
    {
        super( size * 2 + spacing, size * 2 + spacing );
        this.buttonRadius = size;
        this.spacing = spacing;

        this.defaultColor = 'rgb(255, 0, 0)';
        this.pressedColor = 'rgb(150, 0, 0)';

        this.bottomColor = 'rgb(150, 0, 0)';
        this.bottomColorPressed = 'rgb(50, 0,0)';

        this.type = 'MAKEITSO'
    }

    render( ctx )
    {
        // super.render( ctx );
        let height = this.pressed ? 10 : 20;

        ctx.save();
        ctx.translate( this.x, this.y );

        ctx.fillStyle = this.baseColor;

        ctx.beginPath();
        ctx.arc( this.buttonRadius + this.spacing / 2, this.buttonRadius + this.spacing / 2,
            this.buttonRadius + this.spacing / 2, 0, Math.PI * 2 );
        ctx.fill();

        ctx.fillRect( 0, this.buttonRadius + this.spacing / 2, this.width, this.height / 2 );
        
        ctx.save();
        this._drawScrew( ctx, this.spacing / 2, this.height - this.spacing/2 );
        this._drawScrew( ctx, this.width - this.spacing / 2, this.height - this.spacing / 2 );
        this._drawScrew( ctx, this.width/2, this.spacing / 4 );
        ctx.restore();

        ctx.save();
        
        ctx.beginPath();
        ctx.fillStyle = this.pressed ? this.bottomColorPressed : this.bottomColor;

        ctx.arc( this.buttonRadius + this.spacing / 2, this.buttonRadius + this.spacing / 2,
            this.buttonRadius, 0, Math.PI );
        ctx.lineTo( this.spacing / 2, this.buttonRadius + this.spacing / 2 - height);
        ctx.lineTo( this.width - this.spacing / 2, this.buttonRadius + this.spacing / 2 -height);
        ctx.lineTo( this.width - this.spacing / 2, this.buttonRadius + this.spacing / 2);
        ctx.fill();
        ctx.stroke();
        
        
        ctx.beginPath();
        ctx.fillStyle = this.pressed ? this.pressedColor : this.defaultColor;

        ctx.arc( this.buttonRadius + this.spacing / 2, this.buttonRadius + this.spacing / 2 - height,
            this.buttonRadius, 0, Math.PI * 2 );
        ctx.fill();
        
        ctx.stroke();
        
        
        ctx.restore();

        ctx.restore();
    
    }

    mouseDown( pos )
    {
        let p = this._interiorPoint( pos );

        if( p )
        {

            let dx = p[ 0 ] - this.width / 2;
            let dy = p[ 1 ] - ( this.height - this.spacing ) / 2;
        
            if( ( dx * dx + dy * dy ) <= ( this.buttonRadius * this.buttonRadius ) )
            {
                if( !this.pressed )
                {
                    this.pressed = true;
                    this.report();
                }
            }
        }
    }


    report( data )
    {
        super.report( data );
    }
}