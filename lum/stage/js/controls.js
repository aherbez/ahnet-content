class Button extends Entity
{ 
    constructor(size, color, number)
    {
        super();
        this.size = size;
        this.pressedCallback = null;
        this.number = number;

        this.on = false;

        this.buttonColor = 'rgb(200, 0,0)';
        if( color )
        {
            this.buttonColor = 'rgb(' + color.join( ',' ) + ')';;
        }
    }

    render( ctx )
    {
        ctx.fillStyle = this.buttonColor;
        ctx.beginPath();
        ctx.arc( 0, 0, this.size, 0, Math.PI * 2 );
        ctx.fill();

        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.lineWidth = 5;

        if( this.on )
        {
            ctx.beginPath();
            ctx.arc( 0, 0, this.size, 0, Math.PI * 2 );
            ctx.stroke();
        }

        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';

        ctx.fillText( '' + ( this.number ), 0, 10 );
    }

    pointInside( pos )
    {
        let dx = ( pos.x - this.pos.x );
        let dy = ( pos.y - this.pos.y );

        if( ( dx * dx + dy * dy ) <= (this.size*this.size) )
        {
            return true;
        }
        return false;
    }

    mouseDown( pos )
    {
        console.log( "clicked on button" );

        this.on = !this.on;

        if( this.pressedCallback != null )
        {
            this.pressedCallback();
        }
    }

    
}

class FogButton extends Entity
{
    constructor()
    {
        super();
        this.width = 100;
        this.height = 100;

        this.pressedCallback = null;

        this.on = false;
    }

    mouseDown( p )
    {
        this.on = !this.on;

        if( this.pressedCallback != null )
        {
            this.pressedCallback(this.on);
        }
    }

    render( ctx )
    {
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.fillStyle = 'rgb(0,0, 255)';
        ctx.strokeRect( 0, 0, this.width, this.height );

        ctx.fillStyle = 'rgb(0,0,0)';
        // ctx.font
        ctx.textAlign = 'center';
        ctx.fillText( 'FOG', this.width / 2, 20 );

        if( this.on )
        {
            ctx.fillStyle = 'rgb(0,200,0)';
            ctx.fillRect( 10, 30, this.width - 20, this.height - 40 );            
        }
        else
        {
            ctx.fillStyle = 'rgb(100,0,0)';
            ctx.fillRect( 10, 30, this.width - 20, this.height - 40 );
        }

    }
}

class SpotControl extends Entity
{
    constructor()
    {
        super();

        this.width = 120;
        this.height = 40;

        this.controlCallback = null;
    }

    render( ctx )
    {
        ctx.fillStyle = 'rgb(0,0,0)';

        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.strokeRect( -20, -40, this.width + 40, this.height + 60 );

        ctx.font = '20px arial';
        ctx.textAlign = 'center';
        ctx.fillText( 'Main Spot', this.width/2, -20 );


        ctx.beginPath();

        // left-facing arrow
        ctx.moveTo( 0, this.height/2 );
        ctx.lineTo( this.width / 3 - 5, 0 );
        ctx.lineTo( this.width / 3 - 5, this.height );

        // right-facing arrow
        ctx.moveTo( this.width , this.height / 2 );
        ctx.lineTo( this.width / 3 * 2+5, 0 );
        ctx.lineTo( this.width / 3 * 2+5, this.height );

        ctx.fill();

        // middle button, rectangular
        ctx.fillRect( this.width / 3 + 5, 0, this.width / 3 - 10, this.height );
    }

    mouseDown( pos )
    {
        let sliceWidth = this.width / 3;
        let buttonID = Math.floor( ( pos.x - this.pos.x ) / sliceWidth );
        
        if( this.controlCallback != null )
        {
            this.controlCallback( buttonID );
        }
    }
}

class ControlPanel extends Entity
{
    constructor(width, height, spotlights)
    {
        super();

        this.width = width;
        this.height = height;
        
        this.spotColors = spotlights;
        this._setupButtons();

        this.spotControl = new SpotControl();
        this.spotControl.setPos( 400, 50 );
        this.addChild( this.spotControl );
        
        this.fogControl = new FogButton();
        this.fogControl.setPos( 650, 10 );
        this.addChild( this.fogControl );

        this.toggleSpotCallback = null;
        this.controlMainSpotCallback = null;
    }

    _setupButtons()
    {
        let xpos = 70;
        let buttonIndex = 0;
        this.spotColors.forEach( spot =>
        {
            let b = new Button( 30, spot.c, buttonIndex+1);
            b.setPos( xpos, 70 );
            b.pressedCallback = this.spotButtonPressed.bind( this, buttonIndex );
            
            this.addChild( b );
            xpos += 80;
            buttonIndex++;
        } );
    }

    spotButtonPressed( i )
    {
        console.log( "Pressed spot button: " + i );

        if( this.toggleSpotCallback != null )
        {
            this.toggleSpotCallback( i );
        }
    }

    render( ctx )
    {
        ctx.fillStyle = 'rgb(150, 150, 150)';
        ctx.fillRect( 0, 0, this.width, this.height );

        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.strokeRect( 20, 10, 350, 100 );
        
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.font = '20px arial';
        ctx.textAlign = 'center';
        ctx.fillText( 'Color Lights', 200, 30);
    }
}