class Spotlight extends Entity
{
    constructor(color)
    {
        super();

        this.baseColor = 'rgb(100, 100, 100)';
        this.flapColor = 'rgb(50,50,50)';

        this.width = 50;
        this.height = 60;

        this.spread = 30;
        this.distance = 400;

        this.lightValue = color;

        this.strength = 0.4;

        let colorString = color.join( ',' );

        this.color = color;
        this.lightColorOpaque = 'rgb(' + colorString + ')';
        // this.lightColor = 'rgba(' + colorString + ',0.4)';
        this.on = false;
    }

    _getLightColor()
    {
        return 'rgba(' + this.color.join(',') + this.strength + ',0.4)';
    }

    _drawLight( ctx )
    {
        ctx.fillStyle = this._getLightColor();

        ctx.beginPath();
        ctx.moveTo( this.width * 0.4, this.height * 0.25 );
        ctx.lineTo( this.width * 0.5 + this.spread, this.height + this.distance );
        ctx.lineTo( this.width * -0.5 - this.spread, this.height + this.distance );
        ctx.lineTo( this.width * -0.4, this.height * 0.25 );
        ctx.fill();
    }

    render( ctx )
    {
        ctx.fillStyle = this.baseColor;
        ctx.fillRect( -( this.width / 2 ), -( this.height / 2 ), this.width, this.height );
        ctx.beginPath();
        ctx.ellipse( 0, -this.height / 2,
            this.width / 2, 10, 0, Math.PI * 2, false );
        ctx.fill();

        ctx.fillStyle = this.lightColorOpaque;
        ctx.beginPath();
        ctx.ellipse( 0, this.height * 0.25,
            this.width * 0.4, this.height * 0.2,
            0, Math.PI * 2, false );
        ctx.fill();

        ctx.fillStyle = this.flapColor;
        ctx.beginPath();
        ctx.moveTo( -( this.width / 2 ), this.height * 0 );
        ctx.lineTo( -( this.width / 2 ) - 5, this.height * 0 - 15 );
        ctx.lineTo( ( this.width / 2 ) + 5, this.height * 0 - 15 );
        ctx.lineTo( ( this.width / 2 ), this.height * 0 );
        
        ctx.moveTo( this.width / 2, 0 );
        ctx.lineTo( this.width / 2 + 15, -5 );
        ctx.lineTo( this.width / 2 + 15, this.height / 2 - 5 );
        ctx.lineTo(this.width/2, this.height/2);
        ctx.lineTo( this.width / 2, 0 );
        
        ctx.moveTo( -this.width / 2, 0 );
        ctx.lineTo( -this.width / 2 - 15, -5 );
        ctx.lineTo( -this.width / 2 - 15, this.height / 2 - 5 );
        ctx.lineTo( -this.width / 2, this.height / 2 );
        ctx.lineTo( -this.width / 2, 0 );
        
        ctx.moveTo( -( this.width / 2 ), this.height * 0.5 );
        ctx.lineTo( -( this.width / 2 ) - 5, this.height * 0.5 + 15 );
        ctx.lineTo( ( this.width / 2 ) + 5, this.height * 0.5 + 15 );
        ctx.lineTo( ( this.width / 2 ), this.height * 0.5 );

        ctx.fill();

        if( this.on )
        {
            this._drawLight( ctx );
        }

    }
}

class MainSpot extends Spotlight
{
    constructor()
    {
        super( [ 214, 220, 160 ] );
        this.width = 70;
        this.height = 100;
        this.strength = 0.6;
        this.spread = 50;
        this.distance = 700;
    }

}

class Fog extends Entity
{
    constructor(width, fogHeight, fogColor)
    {
        super();

        this.fogHeight = fogHeight;
        this.fogColor = fogColor;
        
        this.gradient = null;

        this.width = width;
        this.height = this.fogHeight;

        this.on = false;
    }

    render( ctx )
    {
        if ( this.gradient == null )
        {
            this.gradient = ctx.createLinearGradient( 0, 0, 0, this.fogHeight );
            this.gradient.addColorStop(0, 'rgba(' + this.fogColor.join(',') + ',0)');
            this.gradient.addColorStop( 1, 'rgba(' + this.fogColor.join( ',' ) + '0.3)' );
        }

        if( this.on )
        {
            ctx.fillStyle = this.gradient;
            ctx.fillRect( 0, 0, this.width, this.height );

        }
    }
}

class Stage extends Entity
{
    constructor(spotColors)
    {   
        super();

        this.lightColors = spotColors;

        this.lights = [];
    
        this._makeLights();


        this.fog = new Fog( 800, 200, [255, 255, 255]);
        this.fog.setPos(0, 260);
        this.addChild( this.fog );


        this.mainSpot = new MainSpot();
        this.mainSpot.setPos( 400, 0 );
        this.addChild( this.mainSpot );
        this.mainSpot.setZIndex( 0 );
        this.mainSpot.on = true;        
    }

    toggleFog(on)
    {
        this.fog.on = on;
    }

    toggleSpot( index )
    {
        if( index < 0 || index >= this.lights.length ) return;

        this.lights[ index ].on = !this.lights[ index ].on;
    }

    controlMainSpot( index )
    {
        this.mainSpot.rotation = ( index * -30 ) + 30;
    }

    _makeLights()
    {
        let sliceWidth = 600 / ( this.lightColors.length - 1 );
        let thetaSlice = 60 / ( this.lightColors.length - 1 );
        this.lightColors.forEach( (spotData, i) =>
        {
            let spot = new Spotlight( spotData.c );
            this.lights.push( spot );
            spot.setZIndex( 10 );
            this.addChild( spot );

            spot.setPos(100 + (sliceWidth * i), 50);
            spot.rotation = -30 + (thetaSlice * i);
        } )
    }


    update( dt )
    {

    }

    render( ctx )
    {
        
    }
}