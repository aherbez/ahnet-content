const STATE_START = 0;
const STATE_SHEET = 1;
const STATE_FRAME = 2;
let state = STATE_START;

let spriteImages = [];
let mainImage = null;
let workareaImg = null;

let imageLoaded = false;

let canvas = null;
let ctx = null;

let gridSize = -1;
let numGridX = 5;
let numFrames = 5;

let selectedFrame = -1;

let selectedSheet = -1;

let data = {
    "source_images": [],
    "items": []
};

let width;
let height;


// UI ELEMENTS
let elGridSize = null;
let elFrameName = null;
let elTransforms = null;

let frameLookup = {};

let bounds = null;

function init()
{
    mainImage = new Image();

    workareaImg = new Image();
    workareaImg.src = "img/workarea.png";

    canvas = document.getElementById( 'stage' );
    canvas.onmousedown = canvasClick;
    ctx = canvas.getContext( '2d' );

    bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;

    elGridSize = document.getElementById( "gridSizeEl" );
    elFrameName = document.getElementById( "frameNameEl" );
    elTransforms = document.getElementById( "transformsEl" );

    document.onkeydown = handleKeyDown;
}

function canvasClick(evt)
{
    let cellSize = width / numGridX;

    let x = Math.floor((evt.clientX - bounds.x)/cellSize);
    let y = Math.floor((evt.clientY - bounds.y)/cellSize);
    
    let newIndex = ( y * numGridX ) + x;
    if( newIndex < numFrames )
    {
        changeFrameTo( newIndex );
    }
}

function dumpData()
{
    let outputEl = document.getElementById( "dataOutput" );
    let startId = parseInt(document.getElementById( "startIdEl" ).value);

    outputData = {};
    outputData.source_images = [ {
        src: "image name",
        id: 1,
        gridSize: gridSize
    } ];
    outputData.items = [];

    data.items.forEach( ( item, i ) =>
    {
        let newItem = {};
        newItem.id = (item.id + startId);
        newItem.offsetX = item.offsetX;
        newItem.offsetY = item.offsetY;
        newItem.name = item.name;
        newItem.transforms = {};

        item.transforms.forEach( ( transform ) =>
        {
            let newId = frameLookup[ transform[ 1 ] ];

            if( newId )
            {
                let newTransform = {};
                newTransform.newId = (newId + startId);

                newItem.transforms[ transform[ 0 ] ] = newTransform;
            }
        } );

        outputData.items.push( newItem );
    } );


    outputEl.innerHTML = JSON.stringify(outputData, null, "\t");
}

function handleKeyDown( event )
{
    // console.log( event.keyCode );

    switch( event.keyCode )
    {
        case 38:
        // case 39:
            {
                changeFrame( 1 );
                break;
            }
        case 40:
        // case 37:
            {
                changeFrame( -1 );
                break;
            }
        case 9:
            {
                if( state == STATE_SHEET ) state = STATE_FRAME;
                else state = STATE_SHEET;
            }
            break;
        default:
            break;
    }
}

function addTransform()
{
    if( selectedFrame != -1 )
    {
        data.items[ selectedFrame ].transforms.push(["new","--undefined--"]);   
    }
    updateTransformUI();
}

function updateTransformUI()
{
    while (elTransforms.firstChild)
    {
        elTransforms.removeChild( elTransforms.firstChild );
    }

    let frameNames = data.items.map( item => item.name );

    data.items[ selectedFrame ].transforms.forEach( ( entry, index ) =>
    {
        let key = entry[ 0 ];
        let value = entry[ 1 ];

        addTransformEntryUi( key, value, frameNames, index );

        console.log( `${key} ${value}` );
        
    } );
}

function addTransformEntryUi( key, value, options, transformIndex )
{

    let baseDiv = document.createElement( 'div' );

    let nameField = document.createElement( "input" );
    nameField.type = "text";
    nameField.value = key;
    nameField.className = "fieldValue";
    nameField.onkeydown = nameField.onchange = function( event )
    {
        data.items[ selectedFrame ].transforms[ transformIndex ][ 0 ] = event.target.value;
    };

    baseDiv.appendChild( nameField );

    let selectBox = document.createElement( 'select' );

    options.forEach( (frameName) =>
    {
        let frameOption = document.createElement( 'option' );
        frameOption.value = frameName;
        frameOption.innerHTML = frameName;
        frameOption.selected = (value == frameName);
        selectBox.appendChild( frameOption );
    } );

    selectBox.onchange = function( event )
    {
        data.items[ selectedFrame ].transforms[ transformIndex ][ 1 ] = event.target.value;
    };

    baseDiv.appendChild( selectBox );
    elTransforms.appendChild( baseDiv );
}

function changeFrame( dir )
{
    // selectedFrame += dir;
    changeFrameTo( selectedFrame + dir );
}

function changeFrameTo( newFrame )
{
    if( newFrame >= numFrames ) newFrame = 0;
    if( newFrame < 0 ) newFrame = numFrames - 1;
    selectedFrame = newFrame;
    
    elFrameName.value = data.items[ selectedFrame ].name;

    updateTransformUI();

}

function setFrameName()
{
    let newName = elFrameName.value;
    let oldName = data.items[ selectedFrame ].name;

    data.items[ selectedFrame ].name = newName;

    data.items.forEach( ( item, i ) =>
    {
        item.transforms.forEach( ( transform ) =>
        {
            if( transform[1] == oldName )
            {
                transform[1] = data.items[ selectedFrame ].name;
            }            
        } );
    } );

    updateFrameNameLookup();
    updateTransformUI();
}

function updateFrameNameLookup()
{
    frameLookup = {};
    data.items.forEach( ( item, i ) =>
    {
        frameLookup[ item.name ] = i;
    } );

    console.log( frameLookup );
}

function updateGridSize()
{
    let newVal = parseInt( elGridSize.value );

    setGridSize( newVal );
}

function setGridSize( size )
{
    gridSize = size;

    data.items = [];

    numGridX = mainImage.width / gridSize;
    numFrames = Math.ceil( mainImage.height / gridSize ) * numGridX;

    for( let i = 0; i < numFrames; i++ )
    {
        if( data.items[ i ] === undefined )
        {
            data.items[i] = {};    
        }

        data.items[ i ].id = i;
        data.items[ i ].offsetX = ( i % numGridX );
        data.items[ i ].offsetY = Math.floor( i / numGridX );
        data.items[ i ].name = data.items[ i ].name || "sprite_"+i;
        data.items[ i ].actions = data.items[ i ].actions || [];
        data.items[ i ].transforms = data.items[ i ].transforms || [];
    }

    updateFrameNameLookup();
}

function drawInitView()
{

}

function drawSpriteSheet()
{
    ctx.clearRect( 0, 0, 800, 600 );

    ctx.fillRect( 0, 0, 800, 600 );

    ctx.save();

    let s = ( mainImage && mainImage.width ) ? 800 / mainImage.width : 1;
    ctx.scale( s, s );

    ctx.drawImage( mainImage, 0, 0 );


    let x, y;

    ctx.lineWidth = 5;

    for( let i = 0; i < numFrames; i++ )
    {
        ctx.strokeStyle = 'rgb(200, 200, 200)';
        x = i % numGridX;
        y = Math.floor( i / numGridX );
        ctx.strokeRect( x * gridSize, y * gridSize, gridSize, gridSize );
    }

    if( selectedFrame != -1 )
    {
        ctx.strokeStyle = 'rgb(255, 0, 0)';
        x = selectedFrame % numGridX;
        y = Math.floor( selectedFrame / numGridX );
        ctx.strokeRect( x * gridSize, y * gridSize, gridSize, gridSize );        
    }

    ctx.restore();

}

function drawFrameView()
{
    ctx.clearRect( 0, 0, width, height );
    ctx.save();

    ctx.fillStyle = '#af7c4e';
    ctx.fillRect( 0, 0, width, height );

    let counterHeight = height * ( 200 / 480 );

    ctx.fillStyle = '#97633c';
    ctx.fillRect( 0, height - counterHeight, width, counterHeight );

    ctx.drawImage( workareaImg, ( ( width / 2 ) - workareaImg.width ) / 2, height - counterHeight - 50 );


    if( selectedFrame != -1 )
    {
        ctx.save();

        ctx.translate( 0, counterHeight-(width/4) );

        let s = (width/2) / gridSize;
        ctx.scale( s, s );

        let sx = ( selectedFrame % numGridX ) * gridSize;
        let sy = Math.floor( selectedFrame / numGridX ) * gridSize;

        ctx.drawImage( mainImage, sx, sy, gridSize, gridSize, 0, 0, gridSize, gridSize );

        ctx.restore();

        if( data.items[ selectedFrame ].transforms.length > 0 )
        {
            drawTransformsForCurrent();    
        }
    }
    ctx.restore();
}

function drawTransformsForCurrent()
{
    let numItems = data.items[ selectedFrame ].transforms.length;

    ctx.save();

    ctx.translate( width / 2, 0 );

    ctx.font = '20px helvetica';

    data.items[ selectedFrame ].transforms.forEach( ( transform, i ) =>
    {
        let name = transform[ 0 ];
        let frameName = transform[ 1 ];
        let frameIndex = frameLookup[ frameName ];

        if( frameIndex )
        {
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect( 0, i * ( width / 4 ), width / 4, width / 4 );
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText( name, 30, i * ( width / 4 ) + width/8 );
            

            ctx.save();
            let s = ( width / 4 ) / gridSize;
            ctx.scale( s, s );

            let sx = data.items[ frameIndex ].offsetX * gridSize;
            let sy = data.items[ frameIndex ].offsetY * gridSize;

            ctx.drawImage( mainImage, sx, sy, gridSize, gridSize, gridSize, (gridSize * i), gridSize, gridSize );

            ctx.restore();

        }    

    } );

    ctx.restore();
}

function render()
{
    if( imageLoaded === false) return;

    switch( state )
    {
        case STATE_START:
            drawInitView();
            break;
        case STATE_SHEET:
            drawSpriteSheet();
            break;
        case STATE_FRAME:
            drawFrameView();
            break;
        default:
            break;
    }

    requestAnimationFrame( render );
}

function drawSelectedFrame()
{

    ctx.save();

    ctx.translate((width-400)/2, (height-400)/2);

    let s = 400 / gridSize;
    ctx.scale( s, s );

    let sx = ( selectedFrame % numGridX ) * gridSize;
    let sy = Math.floor( selectedFrame / numGridX ) * gridSize;

    ctx.drawImage( mainImage, sx, sy, gridSize, gridSize, 0, 0, gridSize, gridSize );

    ctx.restore();
}

function setInitialGrid()
{
    if( mainImage && mainImage.height )
    {
        gridSize = mainImage.height;
    
        let numSprites = mainImage.width / gridSize;
        
        console.log( `found ${ numSprites } items`);
    }
}


function handleFile( event )
{
    let selectedFile = event.target.files[ 0 ];
    let reader = new FileReader();

    reader.onload = function( event )
    {
        document.getElementById( "fileBtn" ).blur();

        mainImage.src = event.target.result;

        setInitialGrid();
        
        imageLoaded = true;
        selectedFrame = 0;

        selectedSheet = data.source_images.length;

        data.source_images.push( {
            "src": selectedFile.name,
            "id": selectedSheet,
            "gridSize": mainImage.height            
        } );
        data.items = [];

        state = STATE_SHEET;

        setGridSize( mainImage.height);
        elGridSize.value = gridSize+'';

        render();
    }

    reader.readAsDataURL( selectedFile );

}

init();