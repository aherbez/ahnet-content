var ctx;
var xpos, ypos;
var fps = Math.floor(1000/30);
var framecount;
var values;
var fall_speed = 30;
var score;
var voice;

var arrow_up;
var arrow_down;
var spreadsheet;
var dd_back;
var person;

var keystates;

var px = 0;
var py = 0;

var aup_x;

var gtest;

function output(text)
{
    document.getElementById('output').innerHTML = text;
}

function setupGrid()
{
    values = new Array();
    for (var i=0; i<10; i++)
    {
        values[i] = new Array();
        for (var j=0; j<4; j++)
        {
            values[i][j] = Math.floor(Math.random() * 1000) / 100;
        }
        values[i][Math.floor(Math.random() * 4)] *= -1;
    }
}

function init()
{
    keystates = [];
    
    aup_x = 400;
    
    /*
    arrow_down = new Image();
    arrow_up = new Image();
    arrow_up.src = 'arrow_up.png';
    arrow_down.src = 'arrow_down.png';
    */
    spreadsheet = new Image();
    spreadsheet.src = 'interface.png';
    dd_back = new Image();
    dd_back.src = 'daydream.png';
    person = new Image();
    person.src = 'person.png';
    
    var canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d');
    
    voice = new Array();
    for (var i=0; i<400; i++)
    {
        voice[i] = 0;
    }
    
    setupGrid();
    
    xpos = 0;
    ypos = 0;
    score = 0;
    
    framecount = 0;
    
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    setInterval(update, 1000/30);
    
    gtest = new GlyphManager(ctx);
}

function handleKeyDown(e)
{
    output(e.keyCode);
    
    keystates[e.keyCode] = true;
    
    switch (e.keyCode)
    {
        case 38:
            ypos--;
            gtest.keyPress(0);
            break;
        case 40:
            ypos++;
            gtest.keyPress(1);
            break;
        case 37:
            xpos--;
            if (xpos < 0) xpos = 0;
            break;
        case 39:
            xpos++;
            if (xpos > 3) xpos = 3;
            break;
        case 87:
            // W
            py--;
            break;
        case 83:
            // S
            py++;
            break;
        case 65:
            // A
            px--;
            break;
        case 68:
            px++;
            break;
    }
}

function handleKeyUp(e)
{
    output(e.keyCode);
    
    keystates[e.keyCode] = null;
    
}

function drawGrid(x, y)
{
    var offsetx = 2 + x;
    var offsety = 22 + y;
    
    ctx.strokeStyle = 'rgb(128,128,128)';
    ctx.drawImage(spreadsheet,x,y);
    
    var cell_width = 50;
    var cell_height = 15;
    
    ctx.fillStyle       = 'rgb(255,255,255)';
    ctx.fillRect(offsetx,offsety,200,150);
    
    ctx.fillStyle = '#888';
    ctx.fillRect(xpos*cell_width + offsetx, 8*cell_height + offsety, cell_width, cell_height);
    
    ctx.fillStyle = '#000';
    for (var i=0; i < 10; i++)
    {
        for (var j=0; j<4; j++)
        {
            if (values[i][j] < 0)
            {
                ctx.fillStyle = '#F00';
            }
            else
            {
                ctx.fillStyle = '#000';
            }
            
            ctx.strokeRect(j*cell_width + offsetx, i*cell_height + offsety, cell_width, cell_height);            
            ctx.fillText(''+values[i][j], (j*cell_width+2) + offsetx, (i+1)*cell_height - 2 + offsety);
        }
    }
    
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(300,0);
    ctx.lineTo(100,100);
}

function drawVoice()
{
    for (var i=1; i<400; i++)
    {
        voice[i-1] = voice[i];
    }
    voice[399] = Math.random();
    
    ctx.fillStyle = '#222';
    ctx.fillRect(0,350,400,40);
    
    ctx.fillRect(199,380,2,20);
    
    ctx.fillStyle = '#fff';
    var height = 0;
    for (var i=0; i<400; i++)
    {
        height = Math.floor(voice[i] * 38);
        ctx.fillRect(i,350+((40-height)/2),1,height);
    }

    // ctx.drawImage(arrow_down, aup_x, 350);
    // aup_x -= 2;
    // if (aup_x < 0) aup_x = 400;
}

function drawDaydream(x, y)
{
    ctx.drawImage(dd_back, x, y);
    ctx.drawImage(person, x+20+px, y+70+py);
}

function dropValues()
{
    for (var i=9; i>0; i--)
    {
        for (var j=0; j<4; j++)
        {
           values[i][j] = values[i-1][j];
        }
    }
    
    var red_index = 0;
    
    for (var i=0; i<4; i++)
    {
        values[0][i] = Math.floor(Math.random() * 1000)/100;
        if (values[8][i] < 0)
        {
            red_index = i;
        }
    }

    values[0][Math.floor(Math.random() * 4)] *= -1;
    
    // score
    if (xpos == red_index)
    {
        score++;
        values[8][red_index] *= -1;
    }
    else
    {
        score--;
    }
}

function drawScore()
{
    var percent = score / 100;
    if (percent > 1) percent = 1;
    if (percent < -0.1) percent = -0.1;
    
    ctx.fillStyle = 'rgb(2,2,2)';
    ctx.fillRect(0,460,500,40);
    
    ctx.fillStyle = 'rgb(0,255,0)';
    ctx.fillRect(4,464,492*percent,32);
}

function update()
{
    
    framecount++;
    if (framecount > 1000) framecount = 0;
    
    if (framecount % fall_speed == 0)
    {
        dropValues();
    }    
    
    ctx.clearRect(0,0,400,400);
    
    // if (score > 50)
    drawDaydream(0,0);
    
    drawGrid(250, 0);
    
    if (score < 10) drawVoice();
    
    drawScore();

    gtest.update();
    
}

init();

