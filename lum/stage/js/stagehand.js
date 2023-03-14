class StageHandGame extends Game
{
    constructor( el )
    {
        super( el );
        
        /*
        this.lightColors = [
            [ 200, 0, 0 ],
            [ 0, 200, 0 ],
            [ 0, 0, 200 ],
            [ 200, 0, 200 ],
            [ 200, 200, 0 ],
            [ 0, 200, 200 ]
        ];
        */

        this.lightColors = [
            { c: [ 200, 0, 0 ], name: 'red' },
            { c: [ 0, 200, 0 ], name: 'green' },
            { c: [ 0, 0, 200 ], name: 'blue' },
            { c: [ 200, 0, 200 ], name: 'purple' },
        ];


        this.acts = {
            'singer': { name: 'Singer', img: 'img/ella.png', center: [0.5, 0.4] },
            'magician': { name: 'Magician', img: 'img/magician.png' },
            'juggler': { name: 'Juggler', img: 'img/juggler.png', center: [ 0.5, 0.6 ] },
            'actor': { name: 'Actor', img: 'img/actor.png', center: [ 0.5, 0.4 ] },
            'brassband': { name: 'Brassband', img: 'img/brassband.png' }
        };

        this.setupActImages();

        this.setList = [];

        let level3 = [
            {
                name: 'singer',
                spots: [ 0, 0, 1, 1],
                main: -1,
                fog: false
            },
            {
                name: 'magician',
                spots: [ 0, 0, 0, 0],
                main: 0,
                fog: true
            },
            {
                name: 'juggler',
                spots: [ 1, 1, 1, 1],
                main: -1,
                fog: true
            },
            {
                name: 'actor',
                spots: [ 0, 1, 0, 0],
                main: -1,
                fog: false
            }
        ];

        let level1 = [
            {
                name: 'actor',
                main: -1
            },
            {
                name: 'juggler',
                main: 0
            }
        ];

        let level2 = [
            {
                name: 'singer',
                spots: [ 0, 0, 1, 1 ],
                main: -1
            },
            {
                name: 'juggler',
                spots: [ 1, 0, 0, 1 ],
                main: 0,
            },
            {
                name: 'brassband',
                spots: [ 1, 1, 1, 1 ],
                main: 0,
            },
        ];


        this.initData( level2 );


        this.controls = new ControlPanel( this.width, 150, this.lightColors );
        this.controls.setPos( 0, this.height - 150 );
        this.controls.setZIndex(10);
        this.addChild( this.controls );

        this.stage = new Stage( this.lightColors );
        this.stage.setZIndex( 11 );
        this.addChild( this.stage );
        this.controls.toggleSpotCallback = this.stage.toggleSpot.bind( this.stage );
        this.controls.spotControl.controlCallback = this.stage.controlMainSpot.bind( this.stage );
        this.controls.fogControl.pressedCallback = this.stage.toggleFog.bind( this.stage );
        
        this.clipboard = new Clipboard();
        this.clipboard.setPos( 400, 600 );
        this.clipboard.init( this.acts );
        this.clipboard.selectionCallback = this.actSelected.bind( this );
        this.addChild( this.clipboard );

        this.drawSetlist = true;

        this.actOnStage = false;
        this.actTime = 0;

        this.actMaxTimeMS = 10 * 1000;
    
        this.actCount = -1;

        this.sortChildren();
        
        this.init();
    }

    initData( data )
    {
        this.setList.length = 0;

        data.forEach( d =>
        {
            this.addAct( d );
        } );
    }

    // addAct( name, imgSrc, coloredSpots, mainSpot, fog )
    addAct( actData )
    {
        let imgSrc = this.acts[ actData.name ].img;

        console.log( imgSrc );

        let act = new Act( actData.name, imgSrc );
        act.order = this.setList.length + 1;

        act.settings.coloredSpots = null;
        act.settings.mainSpot = null;
        act.settings.fogEnabled = null;

        act.settings.time = 3;

        if( actData.hasOwnProperty('spots') )
        {
            act.settings.coloredSpots = actData.spots.slice();
            act.settings.time += 5;
        }
        
        if( actData.hasOwnProperty('main') )
        {
            act.settings.mainSpot = actData.main;
            act.settings.time += 3;
        }

        if( actData.hasOwnProperty('fog') )
        {
            act.settings.fogEnabled = actData.fog;            
            act.settings.time += 3;
        }


        this.setList.push( act );
    }

    setupActImages()
    {
        for( var key in this.acts )
        {
            let actImg = new ActImage( this.acts[ key ].img, this.acts[ key ].center );
            actImg.setPos( this.width / 2, this.height * 0.8 );
            this.acts[ key ].actImg = actImg;
        }
    }

    actSelected(actName)
    {
        console.log( actName );
        actName = actName.toLowerCase();
        if( this.acts.hasOwnProperty( actName ) )
        {
            this.actCount++;
            this.currentAct = this.acts[ actName ].actImg;
            console.log( this.currentAct );
            this.currentAct.setZIndex(50);
            this.addChild( this.currentAct );
            this.actOnStage = true;
            this.actTime = this.setList[ this.actCount ].settings.time * 1000;
            this.actMaxTimeMS = this.actTime;
            console.log( this.actTime );
        }
    }



    _drawSetList( ctx )
    {
        ctx.save();
        ctx.translate(10,10);

        ctx.fillStyle = 'rgb(255, 233, 193)';
        ctx.fillRect(0, 0, 780, 400);

        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText( 'Set List', 395, 50 );

        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        
        for( let i = 0; i < this.setList.length; i++ )
        {
            // ctx.fillText( this.setList[ i ].name, 395, i * 60 + 150 );
            ctx.fillText( this.setList[ i ].getString(), 20, i * 60 + 150 );
        }

        ctx.restore();
    }

    _drawActTimer( ctx )
    {
        ctx.save();

        ctx.translate( this.width / 2, this.height * 0.6 );

        ctx.fillStyle = 'rgb(100,100,100)';
        ctx.fillRect( -110, -15, 220, 30 );
        
        ctx.fillStyle = 'rgb(0, 200, 0)';
        let barLength = ( ( this.actTime / this.actMaxTimeMS ) ) * 200;
        ctx.fillRect( -100, -10, barLength, 20 );

        ctx.restore();
    }

    update( dt )
    {
        if( this.actOnStage )
        {
            this.actTime -= dt;
            
            if( this.actTime <= 0 )
            {
                this.actTime = 0;
                this.actOnStage = false;
                this.removeChild( this.currentAct );
                this.currentAct = null;
                this.clipboard.show();
            }
        }
    }

    mouseDown( p )
    {
        if( this.drawSetlist )
        {
            this.drawSetlist = false;
            this.clipboard.show();
        }
    }
    
    render( ctx )
    {

        ctx.fillStyle = 'rgb(10,10,10)';
        ctx.fillRect( 0, 0, this.width, this.height );

        ctx.fillStyle = 'rgb(153, 99, 0)';
        ctx.fillRect( 0, this.height - 250, this.width, this.height );        

        super.render( ctx );
        
        if( this.actOnStage )
        {
            this._drawActTimer( ctx );
        }

        if( this.drawSetlist )
        {
            this._drawSetList( ctx );
        }

    }
    
}