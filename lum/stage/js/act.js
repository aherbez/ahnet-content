class ActButton extends Entity
{
    constructor( name, imgsrc, imgcenter )
    {
        super();
        this.name = name;
        this.width = 200;
        this.height = 200;
        
        let center = imgcenter || [ 0.5, 0.5 ];

        this.image = new ImageEntity( imgsrc, center );
        this.image.setPos( this.width / 2, 140 );
        
        this.clickedCallback = null;
        
    }

    mouseDown(p)
    {
        if( this.pointInside( p ) )
        {         
            if( this.clickedCallback != null )
            {
                this.clickedCallback( this.name );    
            }
        }
    }

    render( ctx )
    {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.strokeStyle = 'rgb(0,0,0)';

        ctx.fillRect( 0, 0, this.width, this.height );

        
        GameInstance.clearBuffer();
        GameInstance.clipBuffer( this.width, this.height );
        this.image._render( GameInstance.bufferCtx );
        ctx.drawImage( GameInstance.offscreenCanvas, 0, 0 );

        ctx.strokeRect( 0, 0, this.width, this.height );

        ctx.strokeRect( 0, this.height * 0.8, this.width, this.height * 0.2 );
        ctx.fillRect( 0, this.height * 0.8, this.width, this.height * 0.2);
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.textAlign = 'center';
        ctx.font = '20px Arial';
        ctx.fillText(this.name, this.width/2, this.height * 0.95);
        
    }

}

class ActImage extends ImageEntity
{
    constructor( imageSrc )
    {
        super( imageSrc, [ 0.5, 1 ] );
    }

    render( ctx )
    {

    }
    
}

class ActSettings
{
    constructor()
    {
        this.coloredSpots = [];
        this.mainSpot = 0;
        this.fogEnabled = false;

        this.lightColors = ['red','green','blue','purple'];
    }

    getSpotlightString()
    {
        let s = [];
        for( let i = 0; i < this.coloredSpots.length; i++ )
        {
            if( this.coloredSpots[ i ] === 1 || this.coloredSpots[ i ] === true )
            {
                s.push( this.lightColors[i] );
            }
        }

        if( s.length < 1 )
        {
            return 'none';
        }

        return s.join( ',' );
    }

    getMainSpotString()
    {
        let spotLocations = [ "left", "center", "right" ];

        let index = this.mainSpot + 1;
        if( index < 0 ) index = 0;
        if( index >= spotLocations.length ) index = spotLocations.length - 1;

        return spotLocations[ index ];
    }

    getFogString()
    {
        let fogString = ( this.fogEnabled ) ? 'yes' : 'no';
        return `Fog on: ${fogString} `;
    }
}


class Act
{
    constructor( name, imageSrc )
    {
        this.actBtn = new ActButton( name );
        this.actImg = new ActImage( imageSrc );
        this.order = 0;
        this.settings = new ActSettings();
        this.name = name;
    }

    drawAct( ctx )
    {
        this.actImg.render( ctx );
    }

    drawButton( ctx )
    {
        this.actBtn.render( ctx );
    }

    drawInSetlist( ctx )
    {

    }

    getString()
    {
        // let s = this.order + ') ' + this.name;

        const nameCapitalized = this.name.replace( /^\w/, c => c.toUpperCase() );
        let s = `${this.order}) ${nameCapitalized} `;
        if( this.settings.coloredSpots !== null )
        {
            s += ` | Colored lights: ${this.settings.getSpotlightString()}`;            
        }
        if( this.settings.mainSpot !== null )
        {
            s += ` | Main Spot: ${this.settings.getMainSpotString()}`;            
        }
        if( this.settings.fogEnabled !== null )
        {
            s += " | " + this.settings.getFogString();            
        }

        return s;
    
    }
}

class SetList
{
    constructor()
    {

    }
}
