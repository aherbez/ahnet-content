let canvas = null;
let ctx = null;
let outputImg = null;

let mainImage = null;

let illustration = null;

let width, height = 0;
let scalefactor = 0;

let options = [
    ["If you decide to analyze the bubbles,",null],
    ["If you decide to take depth readings,",null]
];

let pageNum = 44;

let noteText = "";

let mainText = "";
let mainTextHeight = 0;

let titleText = "THE CAVE OF TIME";
let seriesText = "CHOOSE YOUR OWN ADVENTURE #1";
let subtitleText = "YOU'RE THE STAR OF THE STORY!\nCHOOSE FROM 40 POSSIBLE ENDINGS";
let authorText = "BY EDWARD PACKARD";
let illustratorText = "ILLUSTRATED BY PAUL GRANGER";

let colorOuter = '#0000FF';
let colorInner = '#FF0000';

function init()
{
    canvas = document.getElementById("page");
    ctx = canvas.getContext('2d');

    illustration = new Image();
    // illustration.src = "imgs/drawing.png";
    illustration.onload = render;

    let bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;

    console.log(`${width}x${height}`);

    scalefactor = width / 600;

    outputImg = document.getElementById("outputImg");

    updateText();
    render();
}

function sendToImage()
{
    outputImg.src = canvas.toDataURL("image/png");
}

function drawMainImage()
{
    let imgWidth = 860;
    let imgHeight = 1000;

    ctx.save();
    ctx.translate(60, 480);

    let sourceWidth = illustration.width;
    let sourceHeight = illustration.height;

    // fill area horizontally first
    let scale = imgWidth / sourceWidth;
    sourceHeight = (1/scale) * imgHeight;
    
    if ((scale * illustration.height) < imgHeight)
    {
        sourceHeight = illustration.height;
        scale = imgHeight / sourceHeight;
        sourceWidth = (1/scale) * imgWidth;
    }

    ctx.drawImage(illustration, 0, 0, sourceWidth, sourceHeight,
        0, 0, imgWidth, imgHeight);
    
    ctx.fillStyle = '#FFF';

    ctx.beginPath();
    ctx.moveTo( 0, 0 );
    ctx.lineTo( 210, 0 );
    ctx.arcTo( 0, 0, 0, 210, 210 );
    ctx.lineTo( 0, 0 );
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo( 860, 0 );
    ctx.lineTo( 860-210, 0 );
    ctx.arcTo( 860, 0, 860, 210, 210 );
    ctx.lineTo( 860, 0 );
    ctx.fill();
    
    ctx.fillRect( 0, imgHeight-80, 50, 80 );
    ctx.fillRect( 810, imgHeight - 80, 50, 80 );
    
    // borders
    ctx.lineWidth = 50;

    ctx.strokeStyle = colorInner;

    ctx.beginPath();
    ctx.moveTo( 210, 0 );
    ctx.lineTo( imgWidth - 210, 0 );
    ctx.arcTo( imgWidth, 0, imgWidth, 210, 210 );
    ctx.lineTo( imgWidth, imgHeight - 80 );
    ctx.lineTo( imgWidth - 50, imgHeight - 80 );
    ctx.lineTo( imgWidth - 50, imgHeight );
    ctx.lineTo( 50, imgHeight );
    ctx.lineTo( 50, imgHeight - 80 );
    ctx.lineTo( 0, imgHeight - 80 );
    ctx.lineTo( 0, 210 );
    ctx.arcTo(0,0, 210, 0, 210);
    ctx.stroke();

    ctx.lineWidth = 20;
    ctx.strokeStyle = colorOuter;

    ctx.beginPath();
    ctx.moveTo( 210, -20 );
    ctx.lineTo( imgWidth - 210, -20 );
    
    ctx.arcTo( imgWidth+20, -20, imgWidth+20, 230, 230 );
    ctx.lineTo( imgWidth+20, imgHeight - 60 );
    ctx.lineTo( imgWidth - 30, imgHeight - 60 );
    ctx.lineTo( imgWidth - 30, imgHeight+20 );
    ctx.lineTo( 30, imgHeight+20 );
    ctx.lineTo( 30, imgHeight - 60 );
    ctx.lineTo( -20, imgHeight - 60 );
    ctx.lineTo( -20, 210 );
    ctx.arcTo( -20, -20, 230, -20, 230 );
    ctx.stroke();


    ctx.restore();

}

function splitTextByWidth(line, maxWidth, fontName, fontSize)
{
    ctx.save();
    ctx.font = `${Math.floor(fontSize)}px ${fontName}`;

    let words = line.split(" ");

    let lines = [];
    let currentLine = [];
    let testString = "";
    let metrics = null;

    words.forEach((w) => {
        testString = currentLine.join(" ");
        metrics = ctx.measureText(testString + " " + w);
        if (metrics.width > maxWidth) {
            lines.push(testString);
            currentLine = [w];
        }
        else {
            currentLine.push(w);
        }
    });
    lines.push(currentLine.join(" "));


    ctx.restore();

    return lines;
}

function drawMainText()
{
    // capsule at top
    {
        ctx.save();
        ctx.translate( 110, 80 );

        ctx.fillStyle = '#e23220';
        ctx.beginPath();
        ctx.arc( 0, 0, 38, 0, Math.PI * 2 );
        ctx.arc( 780, 0, 38, 0, Math.PI * 2 );
        ctx.fill();
        ctx.fillRect( 0, -38, 780, 76 );
    
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.font = '45px BenguiatBTC-bold';
        ctx.textAlign = 'center';
        ctx.fillText( seriesText, 780 / 2, 15 );
    
        ctx.restore();
    }

    // lines
    ctx.save();
    ctx.strokeStyle = 'rgb(80,80,80)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo( 70, 224 );
    ctx.lineTo(width-70, 224);
    ctx.moveTo( 70, 410 );
    ctx.lineTo( width - 70, 410 );
    ctx.stroke();

    // text

    let medFontSize = 40;

    ctx.save();
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.font = `${medFontSize}px BenguiatBTC-med`;
    ctx.textAlign = 'center';    

    let subtitlePs = subtitleText.split( "\n" );

    let subtitleParts = [];

    subtitlePs.forEach( ( p ) =>
    {
        subtitleParts = subtitleParts.concat( splitTextByWidth(
            p,
            width * 0.9,
            'BenguiatBTC-med',
            medFontSize
        ) );
    } );
    
    ctx.save();
    ctx.translate(width/2, 165);
    subtitleParts.forEach( ( line ) =>
    {
        ctx.fillText( line, 0, 0 );
        ctx.translate( 0, Math.floor( ( medFontSize * 1.2 ) ) );
    } );    
    ctx.restore();

    ctx.translate( width / 2, 400 );

    ctx.fillText(authorText, 0, 45);

    ctx.restore();

    // title text
    {
        ctx.save();
        let titleFontSize = 84;
        ctx.fillStyle = '#f03842';
        ctx.font = `${titleFontSize}px BenguiatBTC-bold`;
        ctx.textAlign = 'center';

        let titleParts = splitTextByWidth(
            titleText,
            (width * 0.8),
            'BenguiatBTC-bold',
            titleFontSize
        );

        ctx.translate( width / 2, 300 );
        titleParts.forEach( ( line ) =>
        {
            ctx.fillText( line, 0, 0 );
            ctx.translate( 0, Math.floor( ( titleFontSize * 1 ) ) );
        } );
        ctx.restore();
    }

    // illustrator text
    {
        ctx.save();

        let smFontSize = 30;
        ctx.fillStyle = '#000';
        ctx.font = `${smFontSize}px BenguiatBTC-bold`;
        ctx.textAlign = 'center';

        ctx.fillText( illustratorText, width/2, height-(smFontSize*1.5) );
        ctx.restore();
    }
}

function updateText()
{
    seriesText = document.getElementById("capsuleEl").value;
    subtitleText = document.getElementById( "underCapsuleEl" ).value;
    titleText = document.getElementById( "titleEl" ).value;
    authorText = document.getElementById("authorEl").value;
    illustratorText = document.getElementById( "illustratorEl" ).value;

    colorInner = document.getElementById("colorInnerEl").value;
    colorOuter = document.getElementById( "colorOuterEl" ).value;

    /*
    noteText = document.getElementById("noteEl").value;
    mainText = document.getElementById("mainTextEl").value;

    let newOptions = [];
    let optionEls = [
        'opt-1',
        'opt-2',
        'opt-3',
        'opt-4'
    ];

    let v, pg;
    optionEls.forEach((el, i) => {
        v = document.getElementById(el).value;
        if (v && v != "")
        {        
            pg = parseInt(document.getElementById('pg-'+(i+1)).value);
        
            newOptions.push([v, 
                pg ? pg : null])
        }
    });

    options = newOptions.slice(0);
    pageNum = parseInt(document.getElementById("pageNumEl").value);
    */
    
    render();
}



function render()
{
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgb(255, 255,255)';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgb(100, 100, 100)';
    ctx.strokeRect(2, 2, width-4, height-4);

    drawMainImage();

    drawMainText();

    sendToImage();
}

function handleFile( event )
{
    
    let selectedFile = event.target.files[ 0 ];
    let reader = new FileReader();

    reader.onload = function( event )
    {
        document.getElementById( "fileBtn" ).blur();

        illustration.src = event.target.result;

        render();
    }
    reader.readAsDataURL( selectedFile );
}


init();