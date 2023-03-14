class Rect
{
    constructor( x, y, w, h )
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    setPos( x, y )
    {
        this.x = x;
        this.y = y;
    }

    setSize( w, h )
    {
        this.w = w;
        this.h = h;
    }

    area()
    {
        return this.w * this.h;
    }

    split()
    {
        let splitPos = ( Math.random() * 0.5 ) + 0.25;

        if( this.w > this.h )
        {
            // split vertically
            let splitW = Math.floor(this.w * splitPos);
            return [
                new Rect( this.x, this.y, splitW, this.h ),
                new Rect(this.x + splitW, this.y, this.w - splitW, this.h)
            ]
        }
        else
        {   
            // split horizontally
            let splitH = Math.floor( this.h * splitPos );
            return [
                new Rect(this.x, this.y, this.w, splitH),
                new Rect(this.x, this.y+splitH, this.w, this.h-splitH)
            ]
        }

    }
}

class Panel
{
    constructor( width, height )
    {
        this.width = width;
        this.height = height;

        this.widgets = [];

        this.actionButton = new BigButton( 70, 50 );
        let x = ( this.width - this.actionButton.height ) / 2;
        console.log( x );
        this.actionButton.setPos( ( this.width - this.actionButton.height ) / 2,
            this.height - this.actionButton.height );

        document.addEventListener( 'action', this.processEvent.bind(this) );

        this.instructions = new Instructions( this.width * 0.9, this.height * 0.9 );

        this.outputSlot = new OutputSlot();
        this.outputSlot.setPos(this.width - this.outputSlot.width - 40, this.height - this.outputSlot.height);

        this.instructionsShown = true;

        this.actionIndex = 0;

        // this.initWidgets();
    }

    init( data )
    {
        this.actions = data.actions.slice();
        this.actionIndex = 0;

        for( let i = 0; i < data.widgets.length; i++ )
        {
            let w = data.widgets[ i ];
            let widget = null;
            switch( w.type )
            {
                case 'DEFAULT':
                    widget = new BaseWidget( w.width, w.height );
                    break;
                case 'KEYPAD':
                    widget = new Keypad( w.width, w.height );
                    break;
                case 'DIAL':
                    widget = new Dial(w.minVal, w.maxVal, w.width, w.height);
                    break;
                case 'BUTTONS':
                    break;
                case 'BUTTONPANEL':
                    widget = new ButtonPanel( w.numW, w.numH, w.buttonSize );
                    break;
                case 'SLIDERS':
                    widget = new Sliders(w.num, w.width);
                    break;
                case 'SWITCHES':
                    widget = new Switches( w.switchNum, w.height );
                    break;
                case 'HELP':
                    widget = new Helpbutton();
                    break;
            }

            if( widget != null )
            {
                this._addWidget( widget, w.x, w.y );
            }
        }

        this.instructions.init( data.actions );
    }

    _maybeAdvanceAction( action )
    {
        // console.log( action );
        // console.log( this.actions[ this.actionIndex ] );

        if( action.type == this.actions[ this.actionIndex ].type )
        {
            // console.log( 'RIGHT ACTION' );
            switch( this.actions[ this.actionIndex ].type )
            {
                case 'KEYPAD':
                    let inputdigits = action.digits.join("");
                    return ( inputdigits == this.actions[ this.actionIndex ].value );
                    break;
                case 'DIAL':
                    let diff = Math.abs( action.value - this.actions[ this.actionIndex ].value );
                    console.log( diff );
                    return ( diff < 0.2 );
                    break;
                case 'SLIDERS':
                    for( let i = 0; i < action.sliders.length; i++ )
                    {
                        if( Math.abs( action.sliders[ i ] - this.actions[ this.actionIndex ].value[ i ] ) > 0.2 )
                        {
                            return false;
                        }    
                    }
                    return true;
                    break;
                case 'SWITCHES':
                    
                    for( let i = 0; i < action.switchState.length; i++ )
                    {
                        if( action.switchState[ i ] != this.actions[ this.actionIndex ].value[ i ] )
                        {
                            return false;
                        }
                    }
                    return true;
                    break;
                case 'BUTTONPANEL':
                    let numW = this.actions[ this.actionIndex ].value[ 0 ].length;                    
                    for( let i = 0; i < action.buttonstates.length; i++ )
                    {
                        let x = i % numW;
                        let y = Math.floor( i / numW );
                        if( action.buttonstates[ i ] != this.actions[ this.actionIndex ].value[ y ][ x ] )
                        {
                            return false;
                        }
                    }
                    return true;
                    
                    break;
                default:
                    break;
            }
            // return true;
        }
        else
        {
            console.log('WRONG ACTION');
        }

        return false;

    }

    processEvent( evt )
    {
        evt.stopPropagation();
        evt.preventDefault();


        if( evt.detail.type == "HELP" )
        {
            this.instructionsShown = true;
        }
            


        if( evt.detail.type == "MAKEITSO" )
        {
            // alert( "MAKING A THING!" );
            let goal = this.actions.length - 1;
            let current = this.actionIndex;
            // alert( "MAKING A THING: " + current + "/" + goal );
            
            this.outputSlot.dropBot( current, goal );
        }
        else
        {
            if( this._maybeAdvanceAction( evt.detail ) )
            {
                this.actionIndex++;
            }
        }
    }

    _addWidget( w, x, y )
    {
        w.setPos( x, y );
        w.setID( w.id );
        // w.registerWithPanel( this );
        this.widgets.push( w );
    }

    initWidgets()
    {
        let r = new Rect( 0, 0, this.width, this.height );
        let toSplit = [ r ];

        this.panels = [];

        while( toSplit.length > 0 )
        {
            let curr = toSplit.shift();
            if( curr.area() > ( 250 * 250 ) )
            {
                let newRects = curr.split();    
                toSplit.push( newRects[ 0 ] );
                toSplit.push( newRects[ 1 ] );
            }
            else
            {
                this.panels.push( curr );    
            }
        }

        let bw = null;
        for( let i = 0; i < this.panels.length; i++ )
        {
            bw = new BaseWidget( this.panels[ i ].w - 10, this.panels[ i ].h - 10 );
            
            // bw = new Dial(0,100, this.panels[ i ].w - 10, this.panels[ i ].h - 10 );
            // bw = new Keypad( this.panels[ i ].w - 10, this.panels[ i ].h - 10 );
            // bw = new Switches( Math.floor((this.panels[ i ].w - 10)/50 - 1), this.panels[ i ].h - 10 );

            bw.setPos( this.panels[ i ].x + 5, this.panels[ i ].y + 5 );
            this.widgets.push( bw );
        }
    }

    _drawInstructions(ctx)
    {
        ctx.save();
        ctx.translate( this.width * 0.05, this.height * 0.05 );
        this.instructions.render( ctx );

        ctx.restore();
    }

    update( dt )
    {
        for( let i = 0; i < this.widgets.length; i++ )
        {
            this.widgets[ i ].update( dt );
        }
        
        this.outputSlot.update( dt );
    }

    render( ctx )
    {
        ctx.fillStyle = 'rgb(80, 80, 80)';
        ctx.fillRect( 0, 0, this.width, this.height );

        this.outputSlot.render( ctx );

        // console.log( "RENDERING: " + this.widgets.length );
        for( let i = 0; i < this.widgets.length; i++ )
        {
            this.widgets[ i ].render( ctx );
        }

        this.actionButton.render( ctx );

        

        if( this.instructionsShown )
        {        
            this._drawInstructions( ctx );
        }
    }

    mouseDown( clickPos )
    {
        if( this.instructionsShown )
        {
            this.instructionsShown = false;
            return;
        }

        for( let i = 0; i < this.widgets.length; i++ )
        {
            this.widgets[ i ].mouseDown( clickPos );    
        }

        this.actionButton.mouseDown( clickPos );
    }

}