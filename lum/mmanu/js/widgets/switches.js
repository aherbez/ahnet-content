class Switches extends BaseWidget
{
    constructor( s, height )
    {
        let sWidth = 50;
        let sSpacing = 20;
        let sHeight = height;

        let totalWidth = ( s * sWidth ) + ( ( s + 1 ) * sSpacing );
        super( totalWidth, sHeight );

        this.type = 'SWITCHES';

        this.sWidth = sWidth;
        this.sSpacing = sSpacing;
        this.sHeight = sHeight;

        this.switchNum = s;
        this.switchStates = [];

        for( let i = 0; i < this.switchNum; i++ )
        {
            this.switchStates[ i ] = 0;
        }
    }

    _drawSwitch( ctx, isFlipped )
    {
        ctx.strokeStyle = 'rgb(0,0,0)';

        ctx.beginPath();
        ctx.rect( 0, 10, this.sWidth, this.sHeight - 20 );
        ctx.stroke();

        ctx.fillStyle = 'rgb(200,200,200)';
        ctx.fillRect( this.sWidth * 0.2, this.sWidth * 0.2, this.sWidth * 0.6, this.sHeight * 0.8 );

        ctx.fillStyle = 'rgb(200,0,0)';
        ctx.fillRect( this.sWidth * 0.3, this.sWidth * 0.3, this.sWidth * 0.4, this.sHeight * 0.4 );

        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect( this.sWidth * 0.3, this.sHeight * 0.5, this.sWidth * 0.4, this.sHeight * 0.35 );

        ctx.fillStyle = 'rgb(200,200,200)';
        ctx.beginPath();
        ctx.arc( this.sWidth * 0.5, this.sHeight * 0.5, this.sWidth * 0.45, 0, Math.PI * 2 );
        ctx.fill();

        // actual switch
        let switchW = this.sWidth * 0.6;
        let centerW = 20;

        ctx.save();
        ctx.translate( this.sWidth / 2, this.sHeight / 2 );

        ctx.fillStyle = 'rgb(0,0,100)';

        ctx.beginPath();
        if( isFlipped )
        {
            ctx.arc( 0, 0, centerW / 2, 0, Math.PI );
        }
        else
        {
            ctx.arc( 0, 0, centerW / 2, Math.PI, Math.PI * 2 );
        }
        ctx.fill();

        let yPos = isFlipped ? -this.sHeight * 0.25 : this.sHeight * 0.25;

        ctx.beginPath();
        ctx.moveTo( centerW / 2, 0 );
        // ctx.lineTo( switchW / 2, -this.sHeight * 0.3 );
        // ctx.lineTo( -switchW / 2, -this.sHeight * 0.3 );
        ctx.lineTo( switchW / 2, yPos );
        ctx.lineTo( -switchW / 2, yPos );

        ctx.lineTo( -centerW / 2, 0 );
        ctx.lineTo( centerW / 2, 0 );
        ctx.fill();


        ctx.fillStyle = 'rgb(0,0,200)';
        ctx.fillRect( -switchW / 2, yPos, switchW, 5 );

        ctx.restore();
    }

    render( ctx )
    {
        super.render( ctx );

        ctx.save();
        ctx.translate( this.x, this.y );

        for( let i = 0; i < this.switchNum; i++ )
        {
            ctx.save();

            ctx.translate( ( this.sWidth + this.sSpacing ) * i + this.sSpacing, 0 );
            this._drawSwitch( ctx, (this.switchStates[ i ] === 1) );

            ctx.restore();
        }


        ctx.restore();
    }

    report( data )
    {
        // let s = "SWITCHED " + data[ 0 ] + " TO " + data[ 1 ];
        // super.report( s );
        let report = {};
        report.type = this.type;
        report.justSwitched = data[ 0 ];
        report.switchedTo = data[ 1 ];
        report.switchState = this.switchStates.slice();
        super.report( report );
    }

    mouseDown( clickPos )
    {
        let pos = this._interiorPoint( clickPos );

        if( pos != null )
        {
            let switchBand = this.width / this.switchNum;
            let switchIndex = Math.floor( pos[ 0 ] / switchBand );

            this.switchStates[ switchIndex ] = (this.switchStates[ switchIndex ] + 1) % 2;

            this.report( [ switchIndex, this.switchStates[ switchIndex ] ] );
        }
    }
}