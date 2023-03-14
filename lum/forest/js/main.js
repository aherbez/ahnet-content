const WIDTH = 660;
const HEIGHT = 497;

let canvas = null;
let ctx = null;

let background = null;

let game = null;
let bounds = null;

let lastTick = -1;

function init()
{
    canvas = document.getElementById( 'stage' );
    ctx = canvas.getContext( "2d" );

    bounds = canvas.getBoundingClientRect();

    background = new Image();
    background.src = 'img/Background.png';

    game = new Game( WIDTH, HEIGHT, ctx );
    
    canvas.addEventListener( 'mousedown', mouseDown );

    update();
}

function mouseDown(evt)
{
    let x = evt.clientX - bounds.left;
    let y = evt.clientY - bounds.top;

    game.mouseDown( { x: x, y: y } );
}

function update(now)
{
    let dt = 0;
    if( lastTick != -1 )
    {
        dt = now - lastTick;
    }
    lastTick = now;

    if( dt === dt ) 
    {
        game.update( dt );
    }
    
    render();

    requestAnimationFrame( update );

}

function render()
{
    game.render( ctx );

}



init();