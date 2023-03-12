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
    let imgWidth = Math.floor(width * 0.9);
    let imgHeight = Math.floor(height * 0.5);

    ctx.save();
    let sW = (width * 0.9) / illustration.width;
    let sH = (height * 0.5) / illustration.height;

    let s = Math.min(sW, sH);

    ctx.translate(width*0.05, width*0.1);

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
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.strokeRect(0, 0, imgWidth, imgHeight);

    ctx.restore();
}

function splitTextByWidth(line, maxWidth, fontName, fontSize)
{
    ctx.save();
    ctx.font = `${Math.floor(fontSize * scalefactor)}px ${fontName}`;

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

function drawOptions()
{
    let fontSize = 15;

    let fullOptions = options.map((opt) => {
        return opt[1] ? 
            `${opt[0]} turn to page ${opt[1]}` :
            `${opt[0]} turn to page_______`
    });

    let optionTextParts = [];

    fullOptions.forEach((option) => {
        optionTextParts = optionTextParts.concat(splitTextByWidth(
            option,
            (width * 0.5),
            "BenguiatBTC-bookItalic",
            fontSize
        ));
        optionTextParts.push("");
    });

    ctx.save();
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.font = `${Math.floor(fontSize * scalefactor)}px BenguiatBTC-bookItalic`;

    let metrics = null;
    metrics = ctx.measureText(optionTextParts[0]);

    let ypos = (height) - (Math.floor((fontSize * 1.5) * scalefactor) * optionTextParts.length);

    let linePos = ypos - (fontSize * scalefactor * 1.5);

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width*0.05, linePos);
    ctx.lineTo(width*0.95, linePos);
    ctx.stroke();

    ctx.translate(0, ypos);

    optionTextParts.forEach((line) => {
        metrics = ctx.measureText(line);
        ctx.fillText(line, Math.floor(width*0.95)-metrics.width, 0);

        ctx.translate(0, Math.floor((fontSize * 1.2) * scalefactor));
    });

    ctx.restore();
}

function drawEndText()
{
    let fontSize = 40;

    console.log('drawing end');

    ctx.save();


    ctx.translate(width*0.5, (height * 0.6)+(scalefactor * mainTextHeight));
    ctx.translate(0, fontSize * scalefactor * 1.5);

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.font = `${fontSize * scalefactor}px BenguiatBTC-bold`;
    ctx.textAlign = "center";

    ctx.fillText('The End', 0, 0);



    ctx.restore();
}

function drawMainText()
{
    let fontSize = 14;

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.save();

    let paragraphs = mainText.split("\n");

    let mainTextParts = [];

    paragraphs.forEach((p) => {
        mainTextParts = mainTextParts.concat(splitTextByWidth(
            p,
            (width * 0.9),
            'BenguiatBTC-book',
            fontSize
        ));
        mainTextParts.push("");
    });

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.font = `${Math.floor(fontSize * scalefactor)}px BenguiatBTC-book`;

    ctx.translate(width*0.05, height * 0.6);

    mainTextParts.forEach((line) => {
        metrics = ctx.measureText(line);
        ctx.fillText(line, 0, 0);
        ctx.translate(0, Math.floor((fontSize * 1.2) * scalefactor));
    });

    mainTextHeight = mainTextParts.length * Math.floor(fontSize * 1.2);

    ctx.restore();
}

function updateText()
{
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


    render();
}

function drawPageNumber()
{
    let fontSize = 40;

    ctx.save();

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.font = `${Math.floor(fontSize * scalefactor)}px BenguiatBTC-book`;

    let metrics = ctx.measureText(pageNum+'');

    if (pageNum % 2 == 1)
    {
        // right
        ctx.translate((width*0.95)-metrics.width, height*0.05);
    }
    else
    {
        ctx.translate(width*0.05, height*0.05);
    }

    ctx.fillText(pageNum+'', 0, 0);

    ctx.restore();
}

function drawPersonalNote()
{
    let fontSize = 10;

    ctx.save();

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.font = `${Math.floor(fontSize * scalefactor)}px BenguiatBTC-book`;

    ctx.translate((fontSize * 2), height - (fontSize * 2));

    ctx.fillText(noteText, 0, 0);

    ctx.restore();    
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

    if (options.length > 0)
    {
        drawOptions();
    }
    else
    {
        drawEndText();
    }

    drawPageNumber();

    drawPersonalNote();

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