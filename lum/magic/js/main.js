const dome_input = [ [ 304, 188 ], [ 304, 182 ], [ 304, 176 ], [ 304, 176 ], [ 305, 171 ], [ 306, 166 ], [ 307, 166 ], [ 309, 161 ], [ 312, 156 ], [ 313, 155 ], [ 314, 151 ], [ 316, 146 ], [ 317, 145 ], [ 319, 141 ], [ 321, 136 ], [ 322, 136 ], [ 324, 131 ], [ 326, 126 ], [ 329, 122 ], [ 329, 121 ], [ 332, 116 ], [ 335, 112 ], [ 336, 112 ], [ 339, 107 ], [ 342, 103 ], [ 345, 101 ], [ 346, 99 ], [ 350, 95 ], [ 354, 91 ], [ 358, 87 ], [ 358, 86 ], [ 362, 83 ], [ 366, 81 ], [ 366, 80 ], [ 371, 77 ], [ 376, 74 ], [ 376, 73 ], [ 381, 72 ], [ 386, 70 ], [ 392, 69 ], [ 392, 68 ], [ 397, 67 ], [ 402, 67 ], [ 403, 66 ], [ 408, 66 ], [ 412, 66 ], [ 414, 66 ], [ 419, 66 ], [ 424, 66 ], [ 425, 66 ], [ 430, 66 ], [ 435, 67 ], [ 436, 67 ], [ 441, 68 ], [ 446, 69 ], [ 447, 69 ], [ 452, 70 ], [ 458, 72 ], [ 458, 72 ], [ 463, 74 ], [ 468, 77 ], [ 468, 77 ], [ 472, 80 ], [ 477, 83 ], [ 481, 86 ], [ 481, 86 ], [ 485, 91 ], [ 489, 95 ], [ 489, 95 ], [ 492, 99 ], [ 496, 103 ], [ 496, 103 ], [ 499, 108 ], [ 502, 112 ], [ 503, 113 ], [ 505, 117 ], [ 508, 122 ], [ 510, 125 ], [ 510, 127 ], [ 512, 132 ], [ 514, 136 ], [ 514, 137 ], [ 517, 143 ], [ 519, 147 ], [ 519, 148 ], [ 520, 153 ], [ 522, 158 ], [ 522, 158 ], [ 524, 164 ], [ 526, 169 ], [ 526, 169 ], [ 526, 174 ], [ 526, 175 ] ];
const dome_input2 = [ [ 605, 186 ], [ 605, 178 ], [ 605, 170 ], [ 605, 165 ], [ 605, 162 ], [ 605, 154 ], [ 605, 147 ], [ 604, 146 ], [ 604, 138 ], [ 604, 134 ], [ 603, 131 ], [ 602, 123 ], [ 601, 118 ], [ 600, 115 ], [ 598, 108 ], [ 598, 108 ], [ 595, 100 ], [ 593, 96 ], [ 591, 94 ], [ 584, 89 ], [ 578, 84 ], [ 578, 84 ], [ 572, 80 ], [ 567, 77 ], [ 565, 76 ], [ 558, 72 ], [ 556, 71 ], [ 551, 69 ], [ 544, 66 ], [ 537, 63 ], [ 537, 63 ], [ 529, 60 ], [ 525, 58 ], [ 522, 57 ], [ 514, 54 ], [ 509, 53 ], [ 507, 52 ], [ 499, 51 ], [ 492, 50 ], [ 491, 49 ], [ 484, 48 ], [ 477, 47 ], [ 476, 46 ], [ 468, 46 ], [ 460, 45 ], [ 457, 45 ], [ 453, 45 ], [ 445, 45 ], [ 440, 45 ], [ 437, 45 ], [ 429, 45 ], [ 423, 46 ], [ 421, 46 ], [ 414, 48 ], [ 406, 50 ], [ 403, 52 ], [ 399, 53 ], [ 392, 56 ], [ 385, 60 ], [ 383, 61 ], [ 378, 63 ], [ 371, 67 ], [ 370, 68 ], [ 364, 71 ], [ 358, 76 ], [ 356, 78 ], [ 352, 81 ], [ 346, 86 ], [ 344, 88 ], [ 340, 91 ], [ 335, 97 ], [ 331, 102 ], [ 330, 103 ], [ 325, 110 ], [ 324, 113 ], [ 321, 116 ], [ 318, 123 ], [ 318, 124 ], [ 314, 130 ], [ 312, 136 ], [ 311, 137 ], [ 308, 145 ], [ 308, 147 ], [ 306, 152 ], [ 305, 157 ], [ 304, 160 ], [ 303, 167 ], [ 302, 168 ], [ 301, 175 ], [ 300, 183 ], [ 300, 184 ], [ 299, 191 ], [ 299, 197 ], [ 298, 199 ], [ 298, 207 ], [ 298, 207 ] ];
const down_input = [ [ 533, 17 ], [ 533, 21 ], [ 533, 25 ], [ 533, 29 ], [ 533, 31 ], [ 533, 33 ], [ 533, 37 ], [ 533, 41 ], [ 533, 46 ], [ 533, 50 ], [ 533, 54 ], [ 533, 58 ], [ 533, 60 ], [ 533, 62 ], [ 533, 66 ], [ 533, 71 ], [ 533, 75 ], [ 533, 79 ], [ 533, 83 ], [ 533, 87 ], [ 532, 87 ], [ 532, 91 ], [ 532, 96 ], [ 532, 100 ], [ 532, 104 ], [ 532, 108 ], [ 532, 112 ], [ 532, 113 ], [ 532, 116 ], [ 532, 120 ], [ 532, 125 ], [ 532, 129 ], [ 532, 133 ], [ 532, 137 ], [ 532, 138 ], [ 532, 141 ], [ 532, 145 ], [ 532, 150 ], [ 532, 154 ], [ 532, 158 ], [ 532, 161 ], [ 532, 162 ], [ 532, 166 ], [ 532, 170 ], [ 532, 175 ], [ 532, 177 ], [ 532, 179 ], [ 532, 183 ], [ 532, 187 ], [ 532, 191 ], [ 532, 195 ], [ 532, 196 ], [ 532, 199 ], [ 532, 204 ], [ 532, 208 ], [ 532, 212 ], [ 532, 215 ], [ 532, 216 ], [ 532, 220 ], [ 532, 224 ], [ 532, 229 ], [ 532, 230 ], [ 532, 233 ], [ 532, 237 ], [ 532, 241 ], [ 532, 243 ], [ 532, 245 ], [ 532, 249 ], [ 532, 253 ], [ 532, 254 ], [ 532, 258 ], [ 532, 262 ], [ 532, 266 ], [ 532, 266 ], [ 532, 270 ], [ 532, 274 ], [ 532, 277 ], [ 532, 278 ], [ 532, 279 ]];
const basin_input = [ [ 262, 113 ], [ 262, 119 ], [ 262, 125 ], [ 262, 129 ], [ 262, 131 ], [ 262, 137 ], [ 262, 139 ], [ 262, 143 ], [ 262, 149 ], [ 262, 151 ], [ 262, 155 ], [ 262, 161 ], [ 262, 167 ], [ 262, 167 ], [ 262, 173 ], [ 263, 179 ], [ 264, 185 ], [ 264, 185 ], [ 266, 191 ], [ 269, 196 ], [ 270, 199 ], [ 271, 202 ], [ 275, 207 ], [ 277, 210 ], [ 278, 212 ], [ 282, 216 ], [ 285, 219 ], [ 287, 220 ], [ 292, 223 ], [ 297, 226 ], [ 298, 227 ], [ 303, 228 ], [ 309, 230 ], [ 314, 232 ], [ 315, 233 ], [ 320, 234 ], [ 326, 235 ], [ 331, 237 ], [ 332, 237 ], [ 338, 238 ], [ 343, 239 ], [ 344, 239 ], [ 350, 239 ], [ 355, 240 ], [ 356, 240 ], [ 362, 240 ], [ 368, 241 ], [ 368, 241 ], [ 374, 241 ], [ 380, 241 ], [ 381, 241 ], [ 387, 241 ], [ 393, 241 ], [ 395, 241 ], [ 399, 241 ], [ 405, 241 ], [ 408, 241 ], [ 411, 240 ], [ 417, 238 ], [ 419, 238 ], [ 422, 236 ], [ 428, 234 ], [ 430, 234 ], [ 434, 231 ], [ 439, 229 ], [ 440, 229 ], [ 444, 225 ], [ 448, 223 ], [ 449, 221 ], [ 453, 217 ], [ 455, 215 ], [ 456, 212 ], [ 460, 207 ], [ 461, 207 ], [ 463, 202 ], [ 466, 196 ], [ 468, 193 ], [ 468, 191 ], [ 470, 185 ], [ 472, 180 ], [ 474, 177 ], [ 474, 174 ], [ 475, 168 ], [ 476, 163 ], [ 476, 162 ], [ 476, 156 ], [ 477, 150 ], [ 478, 147 ], [ 478, 144 ], [ 478, 138 ], [ 478, 136 ], [ 478, 132 ], [ 478, 132 ] ];

const WIDTH = 600;
const HEIGHT = 800;

let canvas = null;
let ctx = null;
let recognizer = null;

let points = [];
let drawing = false;

const MINWIDTH = 2;
const MAXWIDTH = 20;

const MIN_DIST = 10;
const MIN_DIST_SQ = MIN_DIST * MIN_DIST;

const symbols = [];

const SYM_SIZE = 100;

let lastTick = -1;

let backImg = null;
let instructionsBack = null;

let seq = null;
let shapeLookup = {};

let instructionsOn = true;
let instructionsAnim = false;
let instructionsPos = HEIGHT * 0.1;

let actionCount = 0;

let gameOver = false;

function init()
{
    canvas = document.getElementById( "stage" );
    ctx = canvas.getContext( "2d" );

    recognizer = new DollarRecognizer();

    addCustom( "dome", dome_input );
    addCustom( "dome", dome_input2 );
    addCustom( "down", down_input );
    addCustom( "basin", basin_input );

    document.onmousedown = mouseDown;
    document.onmousemove = mouseMove;
    document.onmouseup = mouseUp;

    lastTick = performance.now();

    backImg = new Image();
    backImg.src = "img/background.png";

    instructionsBack = new Image();
    instructionsBack.src = "img/instructions_back.png";

    seq = new Sequence(4);

    makeShapeLookup();

    update();
}

function makeShapeLookup()
{
    let name = null;
    for( let i = 0; i < recognizer.Unistrokes.length; i++ )
    {
        name = recognizer.Unistrokes[ i ].Name;
        shapeLookup[ name ] = i;
    }
}

function addCustom(name, pointArray)
{
    let points = [];
    for ( i = 0; i < pointArray.length; i++ )
    {   
        points.push( new Point( pointArray[ i ][ 0 ], pointArray[ i ][ 1 ]))
    }
    recognizer.AddGesture( name, points );
}

function mouseDown(evt)
{
    if (instructionsOn)
    {
        instructionsAnim = true;
    }
    else
    {
        addPoint( evt );
        drawing = true;
    }
}

function mouseMove( evt )
{
    if( !instructionsOn && drawing )
    {
        addPoint( evt );
    }

}

function mouseUp(evt)
{
    if( !instructionsOn && drawing )
    {
        drawing = false;
        addPoint( evt, true);

        let result = recognizer.Recognize( points, false );
        // debugPrintPoints();
        // console.log( result );
        handleResult( result );
        points.splice( 0, points.length );
    }
}

function handleResult( result )
{   
    if( result.Score > 0.8 )
    {
        console.log( result.Name );

        let wasCorrect = (result.Name == seq.actions[actionCount].subtype)

        symbols.push( {
            type: result.Name,
            status: 0,
            correct: wasCorrect,
        } );

        if( wasCorrect )
        {
            actionCount++;
            if( actionCount >= seq.actions.length )
            {
                gameOver = true;    
            }
        }
    }
    else
    {
        console.log( "UNKNOWN" );
    }
}


function debugPrintPoints()
{
    let output = "[";
    for( let i = 0; i < points.length; i++ )
    {
        // output.push( [points[i].X, points[i].Y] );    
        output += "[" + Math.floor(points[ i ].X) + "," + Math.floor(points[ i ].Y) + "],";
    }
    console.log( output );
}

function addPoint( evt, force )
{
    let newX = evt.clientX - 10;
    let newY = evt.clientY - 10;

    let addPoint = true;
    if( !force )
    {
        if( points.length > 0 )
        {
            let lastPoint = points[ points.length - 1 ];
            let distX = newX - lastPoint.X;
            let distY = newY - lastPoint.Y;
            let distSq = ( distX * distX ) + ( distY * distY );
            addPoint = distSq >= MIN_DIST_SQ;
        }
    }

    if( addPoint )
    {
        let p = new Point( newX, newY );
        points.push( p );    
    }
}

function update( now )
{
    let dt = now - lastTick;
    lastTick = now;

    if( instructionsAnim )
    {
        instructionsPos -= ( dt/1000 * ( 800 / 1.2 ) );
        if( instructionsPos < -800 )
        {
            instructionsOn = false;
        }
    }

    render();

    updateSymbols( dt);

    requestAnimationFrame( update );
}

function updateSymbols( dt )
{
    for( let i = 0; i < symbols.length; i++ )
    {
        symbols[ i ].status += dt;    
    }
}

function drawSymbols()
{
    let drawnNum = 0;
    let x = 0;
    let y = 0;

    let colNum = Math.floor( WIDTH / SYM_SIZE ) - 2;

    ctx.save();
    ctx.strokeStyle = "rgba(255,0,0,10)";

    ctx.translate( SYM_SIZE * 1, SYM_SIZE * 1 );

    let didDraw = false;
    for( let i = 0; i < symbols.length; i++ )
    {
        ctx.save();
        x = drawnNum % colNum;
        y = Math.floor( drawnNum / colNum );

        ctx.translate( x * SYM_SIZE * 1.1, y * SYM_SIZE * 1.1 );

        let colorInterp = 1 - Math.min( symbols[ i ].status / 2000, 1 );
        
        if( symbols[ i ].correct )
        {
            ctx.strokeStyle = "rgb(" + Math.floor( colorInterp * 256 ) + ", 255, " + Math.floor( colorInterp * 256 ) + ")";
        }
        else
        {
            ctx.strokeStyle = "rgb(255, " + Math.floor( colorInterp * 256 ) + "," + Math.floor( colorInterp * 256 ) + ")";
        }


        didDraw = drawSymbol( symbols[ i ].type );
        if( didDraw )
        {
            drawnNum++;
        }

        ctx.restore();
    }

    ctx.restore();
}


function drawSymbol( symbol )
{
    let found = true;
    switch( symbol )
    {
        case "circle":
            ctx.beginPath();
            ctx.arc( 0, 0, SYM_SIZE / 2, 0, Math.PI * 2 );
            ctx.stroke();
            break;
        case "dome":
            ctx.beginPath();
            ctx.arc( 0, 0, SYM_SIZE / 2, Math.PI, Math.PI * 2 );
            ctx.stroke();
            
            break;
        case "basin":

            ctx.beginPath();
            ctx.arc( 0, 0, SYM_SIZE / 2, 0, Math.PI );
            ctx.stroke();

            break;
        case "triangle":
            ctx.beginPath();
            ctx.moveTo( SYM_SIZE * -0.5, SYM_SIZE * 0.5 );
            ctx.lineTo( SYM_SIZE * 0.5, SYM_SIZE * 0.5 );
            ctx.lineTo( 0, SYM_SIZE * -0.5 );
            ctx.lineTo( SYM_SIZE * -0.5, SYM_SIZE * 0.5 );
            ctx.stroke();
            break;
        case "rectangle":
            ctx.beginPath();
            ctx.moveTo( SYM_SIZE * -0.5, SYM_SIZE * 0.5 );
            ctx.lineTo( SYM_SIZE * 0.5, SYM_SIZE * 0.5 );
            ctx.lineTo( SYM_SIZE * 0.5, SYM_SIZE * -0.5 );
            ctx.lineTo( SYM_SIZE * -0.5, SYM_SIZE * -0.5 );
            ctx.lineTo( SYM_SIZE * -0.5, SYM_SIZE * 0.5 );
            ctx.stroke();
            break;
        case "zig-zag":
            ctx.beginPath();
            let x = SYM_SIZE * -0.5;
            let y = SYM_SIZE * 0.4;
            ctx.moveTo( x,y );
            
            for( let i = 0; i < 5; i++ )
            {
                x = ( SYM_SIZE / 5 ) * (i+1) - ( SYM_SIZE / 2 );
                y = ( i % 2 == 0 ) ? SYM_SIZE * -0.4 : SYM_SIZE * 0.4;
                ctx.lineTo(x,y);    
            }
            ctx.stroke();
            break;
        case "x":
            ctx.beginPath();
            ctx.moveTo( SYM_SIZE * -0.4, 0 );
            ctx.lineTo( SYM_SIZE * 0.4, 0 );
            ctx.lineTo( 0, SYM_SIZE * -0.4 );
            ctx.lineTo( 0, SYM_SIZE * 0.4 );
            ctx.stroke();
            break;
        case "v":
            ctx.beginPath();
            ctx.moveTo( SYM_SIZE * -0.4, 0 );
            ctx.lineTo( SYM_SIZE * 0.3, SYM_SIZE * 0.3 );
            ctx.lineTo( 0, SYM_SIZE * -0.4 );
            ctx.stroke();
            break;
        default:
            found = false;
            break;
    }
    return found;
}


function drawInstructions()
{
    ctx.save();
    ctx.fillStyle = 'rgb(255, 255, 255)';

    // ctx.fillRect(WIDTH*0.1, 0, WIDTH * 0.8, HEIGHT * 0.8);
    ctx.translate( 0, instructionsPos );
    // ctx.translate( 0, -100 );


    ctx.drawImage(instructionsBack, WIDTH * 0.1, 0);

    for( let i = 0; i < seq.actions.length; i++ )
    {
        ctx.save();
        // console.log( i );
        // ctx.translate( WIDTH / 2, HEIGHT / 2 );

        ctx.strokeStyle = 'rgb(0,100,0)';
        ctx.fillStyle = 'rgb(0, 100, 0)';
        ctx.lineWidth = 4;
        // ctx.translate( WIDTH / 2, (-HEIGHT * 0.4) + ( i * SYM_SIZE ) );
        ctx.translate( WIDTH / 2, ( i * SYM_SIZE * 1.2 ) + 100 );
        
        // console.log( seq.actions[ i ].subtype );
        ctx.font = "30px Arial";
        ctx.fillText( "Draw", -WIDTH * 0.3, 0 );
        drawSymbol( seq.actions[ i ].subtype );
        
        ctx.restore();
    }


    ctx.restore();

}

function drawEndState()
{
    ctx.save();

    ctx.drawImage( instructionsBack, WIDTH * 0.1, HEIGHT * 0.1 );
    ctx.strokeStyle = 'rgb(0,100,0)';
    ctx.fillStyle = 'rgb(0, 100, 0)';
    
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText( "Well done!", WIDTH * 0.5, HEIGHT * 0.4 );

    for( let i = 0; i < seq.actions.length; i++ )
    {
        ctx.save();

        ctx.strokeStyle = 'rgb(0,100,0)';
        ctx.fillStyle = 'rgb(0, 100, 0)';
        ctx.lineWidth = 4;
        // ctx.translate( WIDTH / 2, (-HEIGHT * 0.4) + ( i * SYM_SIZE ) );
        ctx.translate( ( i * SYM_SIZE * 1.2 ) + WIDTH * 0.1 + 50, HEIGHT / 2 );
        
        ctx.scale( 0.8, 0.8 );
        drawSymbol( seq.actions[ i ].subtype );

        ctx.restore();
    }

    ctx.fillText( "Symbols drawn: " + symbols.length, WIDTH * 0.5, HEIGHT * 0.65 );
    ctx.fillText( "Spell length: " + seq.actions.length, WIDTH * 0.5, HEIGHT * 0.7 );

    if( symbols.length == seq.actions.length )
    {
        ctx.fillText( "PERFECT!", WIDTH * 0.5, HEIGHT * 0.75 );
    }


    ctx.restore();
}

function render()
{
    ctx.clearRect( 0, 0, WIDTH, HEIGHT );
    ctx.drawImage( backImg, 0, 0 );

    drawSymbols();

    /*
    ctx.save();
    ctx.translate(WIDTH/2,HEIGHT/2);
    drawStroke( 1, 10, "rgb(0,0,0)", recognizer.Unistrokes[ 11 ].Points );
    ctx.restore();
    */
    
    drawStroke( MINWIDTH, MAXWIDTH, "rgb(0,0,100)", points);
    drawStroke( MINWIDTH * 0.5, MAXWIDTH * 0.5, "rgb(0,0,255)", points );
    
    drawInstructions();

    if( gameOver )
    {
        drawEndState();
    }

}




function drawStroke( minSize, maxSize, color, drawPoints )
{
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    if( drawPoints.length > 1 )
    {
        let currLineWidth = 0;
        let numSegments = drawPoints.length - 1;
        let increasePerSegment = ( maxSize - minSize ) / numSegments;

        ctx.beginPath();
        ctx.moveTo( drawPoints[ 0 ].X, drawPoints[ 0 ].Y );

        ctx.lineWidth = MINWIDTH;

        for( let i = 1; i < drawPoints.length; i++ )
        {
            currLineWidth = MINWIDTH + ( i * increasePerSegment );
            ctx.lineWidth = currLineWidth;

            ctx.lineTo( drawPoints[ i ].X, drawPoints[ i ].Y );
            ctx.stroke();

            ctx.beginPath()
            ctx.arc( drawPoints[ i ].X, drawPoints[ i ].Y, currLineWidth / 2, 0, Math.PI * 2 );
            ctx.fill();

            // start the new segment
            ctx.beginPath();
            ctx.moveTo( drawPoints[ i ].X, drawPoints[ i ].Y );
        }

    }
}

init();