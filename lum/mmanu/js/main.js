const WIDTH = 800;
const HEIGHT = 600;

let canvas = null;
let ctx = null;

let w = null;
let d = null;
let k = null;
let s = null;
let b = null;
let posOffset = [];

let widgets = [];

let defaultWidgets = [
    {
        type: 'SWITCHES',
        switchNum: 4,
        height: 100,
        x: 5,
        y: 380,
        id: 0,
    },
    {
        type: 'KEYPAD',
        width: 250,
        height: 350,
        x: 10,
        y: 10,
        id: 1,
    },
    {
        type: 'DIAL',
        width: 200,
        height: 100,
        minVal: 0,
        maxVal: 100,
        x: 290,
        y: 10,
        id: 2,
    },
    {
        type: 'SLIDERS',
        width: 200,
        num: 5,
        minVal: 0,
        maxVal: 100,
        x: 290,
        y: 120,
        id: 4,
    },
    {
        type: 'BUTTONPANEL',
        numW: 4,
        numH: 2,
        buttonSize: 40,
        x: 520,
        y: 10
    },
    {
        type: 'HELP',
        x: 10,
        y: 500
    }
];

let panel = null;

let lvl1 = {
    widgets: defaultWidgets,
    actions: [
        {
            type: 'SWITCHES',
            value: [ 0, 1, 0, 1 ]
        },
        {
            type: 'BUTTONPANEL',
            value: [ [ 0, 0, 1, 0 ],
            [ 0, 1, 0, 0 ] ]
        },
        {
            type: 'MAKEITSO'
        }
    ]
};

let lvl2 = {
    widgets: defaultWidgets,
    actions: [
        {
            type: 'KEYPAD',
            value: '8917',
        },
        {
            type: 'SWITCHES',
            value: [ 0, 1, 0, 1 ]
        },
        {
            type: 'SLIDERS',
            value: [ 0.5, 1, 0, 0, 1 ]
        },
        {
            type: 'MAKEITSO'
        }
    ]
};


let lvl3 = {
    widgets: defaultWidgets,
    actions: [
        {
            type: 'DIAL',
            value: 0.8
        },
        {
            type: 'KEYPAD',
            value: '1234',
        },
        {
            type: 'BUTTONPANEL',
            value: [ [ 0, 1, 1, 0 ],
                    [1, 0, 0, 1 ] ]
        },
        {
            type: 'SWITCHES',
            value: [1,1,0,1]
        },
        {
            type: 'SLIDERS',
            value: [0.5, 1, 0, 0, 1]
        },
        {
            type: 'MAKEITSO'
        }
    ]
};

let levelData = [ lvl1, lvl2, lvl3 ];

function init()
{
    canvas = document.getElementById( 'stage' );

    let bounds = canvas.getBoundingClientRect();
    posOffset[ 0 ] = bounds.x;
    posOffset[ 1 ] = bounds.y;

    ctx = canvas.getContext( '2d' );

    document.onmousedown = mouseDown;
    document.onmouseup = mouseUp;

    playlevel1();

    update();
}

function playlevel1()
{
    startLevel( 1 );
}

function playlevel2()
{
    startLevel( 2 );
}

function playlevel3()
{
    startLevel( 3 );
}

function startLevel( num )
{
    panel = new Panel( WIDTH, HEIGHT );
    panel.init( levelData[num-1] );
}

function getCanvasPos( clientX, clientY )
{
    return [clientX - posOffset[0], clientY - posOffset[1]];
}

function mouseDown( evt )
{
    let clickPos = getCanvasPos( evt.clientX, evt.clientY );
    // console.log( getCanvasPos( evt.clientX, evt.clientY ) );

    for( i = 0; i < widgets.length; i++ )
    {
        widgets[ i ].mouseDown( clickPos );    
    }

    if( panel )
    {
        panel.mouseDown( clickPos );
        
    }
    
}

function mouseUp( evt )
{
    // console.log( getCanvasPos( evt.clientX, evt.clientY ) );
    let clickPos = getCanvasPos( evt.clientX, evt.clientY );
    for( i = 0; i < widgets.length; i++ )
    {
        widgets[ i ].mouseUp( clickPos );
    }
}

function update(dt)
{
    if( panel )
    {
        panel.update( dt );    
    }
    
    
    render();

    requestAnimationFrame( update );
}

function render()
{
    ctx.clearRect( 0, 0, WIDTH, HEIGHT );

    ctx.fillRect( 0, 0, WIDTH, HEIGHT );



    if( panel )
    {
        panel.render( ctx );    
    }

    /*
    for( let i = 0; i < widgets.length; i++ )
    {
        widgets[ i ].render( ctx );
    }
    */

}

init();