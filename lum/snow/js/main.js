const WIDTH = 700;
const HEIGHT = 700;

let canvas = null;
let ctx = null;
let can1 = null;
let offCtx = null;


let flakes = [];
let correct = -1;
let num = 4;

let back = null;
let posOffset = [];


function init()
{
    canvas = document.getElementById( "stage" );
    ctx = canvas.getContext( "2d" );

    let bounds = canvas.getBoundingClientRect();
    console.log( bounds );
    posOffset[ 0 ] = bounds.x;
    posOffset[ 1 ] = bounds.y;

    offscreen = document.getElementById( 'offscreen' );
    can1 = document.createElement( 'canvas' );
    can1.width = WIDTH;
    can1.height = HEIGHT;
    offscreen.appendChild( can1 );
    offCtx = can1.getContext( "2d" );


    back = new Image();
    back.src = 'back.png';

    // f = new Flake( 300 );
    let f = null;

    for( let i = 0; i < num; i++ )
    {
        f = new Flake( 300 );    
        flakes.push( f );
    }
    correct = Math.floor( Math.random() * num );

    document.onmousedown = mouseDown;

    update();
}

function update()
{
    render();

    requestAnimationFrame( update );
}


function mouseDown( evt )
{
    let x = evt.clientX - posOffset[ 0 ];
    let y = evt.clientY - posOffset[ 1 ];

    let slice = WIDTH / num;

    let choice = Math.floor( x / slice );

    if( choice == correct )
    {
        alert( 'YES!' );
    }
    else
    {
        alert( 'NOPE!' );
    }
}

function render()
{
    ctx.save();
    ctx.drawImage( back, 0, 0 );
    // ctx.fillStyle = 'rgb(0, 0, 200)';
    // ctx.fillRect( 0, 0, WIDTH, HEIGHT );
    ctx.restore();

    
    // ctx.globalCompositeOperation = "multiply";
    offCtx.width = offCtx.width;
    offCtx.save();   
    offCtx.translate( WIDTH / 2, HEIGHT * 0.6 );
    offCtx.scale( 0.7, 0.7 );
    flakes[correct].drawSnowflake( offCtx );
    offCtx.restore();

    let slice = WIDTH / num;
    for( let i = 0; i < flakes.length; i++ )
    {
        offCtx.save();
        offCtx.translate( slice * i + slice / 2, HEIGHT * 0.25 );
        offCtx.scale( 0.4, 0.4 );
        flakes[ i ].drawSlice( offCtx );


        offCtx.restore();
    }

    ctx.drawImage( can1, 0, 0 );



}

init();