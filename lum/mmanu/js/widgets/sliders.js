class Sliders extends BaseWidget
{
    constructor( num, width )
    {
        let sliderHeight = 40;
        let sliderSpacing = 10;
        let totalHeight = ( sliderHeight + sliderSpacing ) * num;
        super( width, totalHeight );

        this.sliderHeight = sliderHeight;
        this.sliderSpacing = sliderSpacing;
        this.numSliders = num;

        this.sliderStates = [];
        for( let i = 0; i < this.numSliders; i++ )
        {
            this.sliderStates[ i ] = 0.5;
        }

        this.type = 'SLIDERS';
    }

    _drawSlider( ctx, index )
    {
        ctx.save();

        ctx.strokeStyle = 'rgb(0,0,0)';

        ctx.beginPath();
        ctx.rect( 0, 0, this.width - 20, this.sliderHeight );
        ctx.stroke();


        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect( 10, this.sliderHeight / 2 - 2,
            this.width - 40, 4 );

        // slider
        let sliderPos = this.sliderStates[ index ] * ( this.width - 40 );
        sliderPos += 20;

        ctx.fillStyle = '#B2371F';
        ctx.fillRect( sliderPos - 10, this.sliderHeight / 2 - 20, 20, 40 )

        ctx.fillStyle = '#E14829';
        ctx.fillRect( sliderPos - 6, this.sliderHeight / 2 - 15, 12, 30 )

        ctx.restore();
    }


    render( ctx )
    {
        super.render( ctx );

        ctx.save();
        ctx.translate( this.x, this.y );

        for( let i = 0; i < this.numSliders; i++ )
        {
            ctx.save();
            ctx.translate( 10, i * ( this.sliderHeight + this.sliderSpacing ) + this.sliderSpacing / 2 );
            this._drawSlider( ctx, i );
            ctx.restore();
        }

        ctx.restore();
    }

    mouseDown( clickPos )
    {
        let localPos = this._interiorPoint( clickPos );

        if( localPos != null )
        {
            // which slider?
            let index = Math.floor( localPos[ 1 ] / ( this.height / this.numSliders ) );
            let value = ( localPos[ 0 ] - 20 ) / ( this.width - 40 );
            if( value < 0 ) value = 0;
            if( value > 1 ) value = 1;
            this.sliderStates[ index ] = value;

            this.report();
        }
    }

    report()
    {
        let data = {};
        data.sliders = this.sliderStates.slice();
        super.report( data );
    }
}