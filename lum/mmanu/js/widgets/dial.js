class Dial extends BaseWidget
{
    constructor( startVal, endVal, w, h )
    {
        super( w, h );

        let triW = 30;
        let triH = this.height * 0.8;

        // this.edgeAngle = Math.PI * 0.4;
        this.edgeAngle = Math.atan2( triW, triH );
        this.dialR = ( ( this.width / 2 ) - 10 ) / Math.sin( this.edgeAngle );

        this.value = 0.5;
        this.minVal = startVal;
        this.maxVal = endVal;

        this.type = 'DIAL';
    }

    _drawDialBack( ctx )
    {
        ctx.save();

        let centx = this.width / 2;
        // let r = ( (this.width / 2) - 10 ) / Math.sin(this.edgeAngle);

        ctx.translate( this.width / 2, this.dialR + 10 );

        let thetaStart = ( Math.PI * 1.5 ) - this.edgeAngle;
        let thetaEnd = ( Math.PI * 1.5 ) + this.edgeAngle;

        ctx.fillStyle = '#F3EFAD';
        ctx.strokeStyle = 'rgb(0,0,0)';

        let divisions = 32;

        let theta = thetaStart;
        let slice = ( thetaEnd - thetaStart ) / ( divisions - 1 );
        let r = this.dialR;

        ctx.beginPath();

        ctx.moveTo( Math.cos( theta ) * this.dialR, Math.sin( theta ) * this.dialR );
        for( let i = 0; i < divisions; i++ )
        {
            theta += slice;
            ctx.lineTo( Math.cos( theta ) * r, Math.sin( theta ) * r );
        }

        r -= 40;
        for( let i = 0; i < divisions; i++ )
        {
            theta -= slice;
            ctx.lineTo( Math.cos( theta ) * r, Math.sin( theta ) * r );
        }
        theta = thetaStart;
        ctx.lineTo( Math.cos( theta ) * this.dialR, Math.sin( theta ) * this.dialR );

        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    _drawDialTicks( ctx, num )
    {
        ctx.save();
        ctx.translate( this.width / 2, this.dialR + 10 );

        let thetaStart = ( Math.PI * 1.5 ) - this.edgeAngle;
        let thetaEnd = ( Math.PI * 1.5 ) + this.edgeAngle;

        let theta = thetaStart;
        let slice = ( thetaEnd - thetaStart ) / num;

        let r1 = this.dialR - 5;
        let r2 = this.dialR - 35;

        for( let i = 0; i < num - 1; i++ )
        {
            theta += slice;
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(0,0,0)';
            ctx.lineWidth = 2;

            ctx.moveTo( Math.cos( theta ) * r1, Math.sin( theta ) * r1 );
            ctx.lineTo( Math.cos( theta ) * r2, Math.sin( theta ) * r2 );

            ctx.stroke();
        }
        ctx.restore();
    }



    _drawDialState( ctx )
    {
        ctx.save();

        let angle = this.value * ( this.edgeAngle * 2 );
        angle = ( Math.PI * 1.5 ) - this.edgeAngle + angle;

        ctx.translate( this.width / 2, this.dialR );
        ctx.rotate( angle );

        ctx.fillStyle = "#A53928";
        ctx.fillRect( this.dialR - 50, -5, 30, 10 );

        ctx.restore();
    }

    render( ctx )
    {
        super.render( ctx );

        ctx.save();
        ctx.translate( this.x, this.y );

        ctx.save();
        // ctx.translate( this.width / 2, 0);

        this._drawDialBack( ctx );
        this._drawDialTicks( ctx, 20 );
        this._drawDialState( ctx );


        ctx.restore();

        ctx.restore();
    }

    mouseDown( clickPos )
    {
        let pos = this._interiorPoint( clickPos );

        if( pos != null )
        {
            this.value = pos[ 0 ] / this.width;

            this.report();
        }
    }

    _getValue()
    {
        let scaledValue = ( ( this.maxVal - this.minVal ) * this.value ) + this.minVal;
        return scaledValue.toFixed( 2 );
    }

    report( data )
    {
        let evtData = {};
        evtData.value = this.value;
        super.report( evtData );
    }
}