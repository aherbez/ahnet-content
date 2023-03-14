var ctx;
var fps = 1000/30;

var worldRot = 0;
var worldPix;
var comets;
var waitTime;
var worldAngle;
var worldSize = 10;
var TWO_PI = 6.2831853071795862;
var shieldOn;
var shieldSize;
var turnDir = 0;

var worldComp;
// var TYPE_COUNT = 2;

var currentLevel;

var border;
var borderSize;

var keystates;

var coreImg;
var backImg;

var state;
var STATE_INTRO = 0;
var STATE_LEVEL_DESC = 1;
var STATE_PLAY = 2;
var STATE_RESULT = 3;
var STATE_BEAT_GAME = 4;

var targetSize;

function handleKeyDown(e)
{
    // output(e.keyCode);
    
    keystates[e.keyCode] = true;
    
    switch (e.keyCode)
    {
        case 38:
            break;
        case 40:
            break;
        case 37:
            // Left
            turnDir = -1;
            
            break;
        case 39:
            // Right
            turnDir = 1;
            /*
            worldAngle += 0.2;
            if (worldAngle > TWO_PI)
            {
                worldAngle = 0;
            }
            */
            break;
        case 87:
            // W
            switch (state)
            {
                case STATE_PLAY:
                    shieldOn = true;
                    break;
                case STATE_INTRO:
                    showLevelDesc();
                    break;
                case STATE_LEVEL_DESC:
                    startGame()
                    break;
                case STATE_RESULT:
                {
                    var beat_game = false;
                    if (won)
                    {
                        currentLevel++;
                        if (currentLevel > levels.length-1)
                        {
                            currentLevel = 0;
                            // state = STATE_BEAT_GAME;
                            beat_game = true;
                        }
                    }
                    
                    if (beat_game)
                    {
                        state = STATE_BEAT_GAME;
                    }
                    else
                    {
                        state = STATE_LEVEL_DESC;
                    }
                }
                break;
                case STATE_BEAT_GAME:
                    {
                        currentLevel = 0;
                        state = STATE_INTRO;
                    }
            }
            break;
        case 83:
            // S
            break;
        case 65:
            // A
            break;
        case 68:
            break;
    }
}

function handleKeyUp(e)
{
    // output(e.keyCode);
    keystates[e.keyCode] = null;
    
    switch (e.keyCode)
    {
        case 38:
            break;
        case 40:
            break;
        case 37:
            // Left
            turnDir = 0;
            break;
        case 39:
            // Right
            turnDir = 0;
            break;
        case 87:
            // W
            shieldOn = false;
            break;
        case 83:
            // S
            break;
        case 65:
            // A
            break;
        case 68:
            break;
    }
    
}

function init()
{
    state = STATE_INTRO;
    
    var canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d');

    keystates = new Array();
    
    coreImg = new Image();
    coreImg.src = 'core.png';
    
    backImg = new Image();
    backImg.src = 'background.jpg';
        
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;    
    
    setInterval(update, fps);
    
    currentLevel = 0;
}

function addNewPart()
{
    var np = new Pix();
    var angle =  Math.random() * 6.28;
    np.setPos(Math.cos(angle) * 250, Math.sin(angle) * 250);
    np.angle = angle;
    
    var type = 0;
    var rand = Math.random();
    
    var comp = levels[currentLevel].prob[0];
    
    // rand = 0.8
    // comp = 0.5
    while (rand > comp)
    {
        type++;
        comp += levels[currentLevel].prob[type];
    }
    np.type = type;
        
    
    comets.push(np);
    
    waitTime = Math.random() * 100;
}

function update()
{
    // worldSize += 0.01;
    
    if (state == STATE_PLAY)
    {
        if (turnDir != 0)
        {
            worldAngle += turnDir * 0.2;
            if (worldAngle < 0)
            {
                worldAngle = TWO_PI;
            }
            if (worldAngle > TWO_PI)
            {
                worldAngle = 0;
            }
        }
        
        
        if (waitTime <= 0)
        {
            addNewPart();
        }
        else
        {
            waitTime--;    
        }
        
        updateComets();
    }
    render();
}

function checkBorder()
{

    var out = worldSize + ' ' + border.length + ': ';   
    
    var grow = true;
    
    for (var i=0; i < border.length; i++)
    {        
        out += border[i] + ' ';
        if (border[i] != 1)
        {
            grow = false;
        }
    }
    
    // output(out);
    
    if (grow)
    {
        worldSize += 5;
        shieldSize = worldSize + 5

        borderSize = Math.floor(worldSize * TWO_PI / 8);
        output('borderSize' + borderSize);
        
        // borderSize += borderSize/2;
        
        for (var i=0; i < borderSize; i++)
        {
            border[i] = 0;
        }
        
        
        if (worldSize > levels[currentLevel].size)
        {
            checkResult();
        }
    }
}

function checkResult()
{
    var temp_won = true;
    
    var crit;
    var percent;
    
    // alert(levels[currentLevel].crit.length);
    
    for (var i=0; i<levels[currentLevel].crit.length; i++)
    {
        crit = levels[currentLevel].crit[i];
        // output('critC' + crit.c);        
        switch (levels[currentLevel].crit[i].c)
        {
            case 'gte':
                {
                    
                    percent = worldComp[crit.t] / worldPix.length;
                    output('gte: ' + percent + crit.v);
                    if (percent < crit.v)
                    {
                        output('CRIT FAILED');
                        temp_won = false;
                    }
                }
                break;
            case 'lte':
                {
                    percent = worldComp[crit.t] / worldPix.length;
                    if (percent > crit.v)
                    {
                        output('CRIT FAILED: ')
                        temp_won = false;
                    } 
                }
                break;
        }
    }
    won = temp_won;
    state = STATE_RESULT;

}

function drawWorld()
{
    ctx.drawImage(coreImg,-5,-5);
    
    for (var i=0; i < worldPix.length; i++)
    {
        worldPix[i].draw(ctx);
    }
}

function updateComets()
{
    var dist;
    var np;
    var theta;
    
    var bIndex;
    
    for (var i=0; i < comets.length; i++)
    {
        if (comets[i].repel)
        {
            comets[i].setPos(comets[i].x * 1.05, comets[i].y * 1.05);
        }
        else
        {
            comets[i].setPos(comets[i].x * 0.96, comets[i].y * 0.96);
        }
        dist = (comets[i].x * comets[i].x + comets[i].y * comets[i].y);
        
        if (shieldOn && dist < (shieldSize * shieldSize))
        {
            comets[i].repel = true;
        }
        
        if (dist < (worldSize*worldSize))
        {
            comets[i].remove = true;
            
            np = new Pix();
            
            theta = comets[i].angle;
            theta -= worldAngle;
            
            bIndex = Math.floor(theta / 6.28 * borderSize);
            if (bIndex < 0)
            {
                bIndex += borderSize;
            }
            border[bIndex] = 1;
            // output('theta: ' + theta + ' bIndex: ' + bIndex + ' | ' + border.length);
            
            // np.setPos(comets[i].x, comets[i].y);
            np.setPos(Math.cos(theta) * worldSize, Math.sin(theta) * worldSize);
            np.type = comets[i].type;
            worldPix.push(np);
            
            worldComp[np.type]++;
            
            checkBorder();
        }
        
        // remove regjected bits that are offscreen
        if (dist > 500*500)
        {
            comets[i].remove = true;
        }
    }
    
    var c;
    
    for (var i=comets.length - 1; i >= 0; i--)
    {
        if (comets[i].remove)
        {
            c = Pix(comets.splice(i,1));
        }
    }
    
    // output(comets.length + ' ' + worldPix.length)
}

function drawComets()
{
    for (var i=0; i < comets.length; i++)
    {
        comets[i].draw(ctx);
    }   
}

function drawShield()
{
    if (shieldOn == false)
    {
        return;
    }
        
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shieldSize,0);
    
    var theta = TWO_PI / 32;
    for (var i=0; i < 32; i++)
    {
        ctx.lineTo(Math.cos(theta) * shieldSize, Math.sin(theta) * shieldSize);
        theta += TWO_PI/32;
    }
    
    ctx.stroke();
}


function drawTargetSize()
{
    
    ctx.strokeStyle = 'rgb(128,128,128)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(targetSize,0);
    
    var theta = TWO_PI / 64;
    for (var i=0; i < 64; i++)
    {
        if (i%2==0)
        {
            ctx.lineTo(Math.cos(theta) * targetSize, Math.sin(theta) * targetSize);
        }
        else
        {
            ctx.moveTo(Math.cos(theta) * targetSize, Math.sin(theta) * targetSize);            
        }
        theta += TWO_PI/64;
    }
    
    ctx.stroke();
}

function drawLegend()
{
    
}

function drawComposition()
{
    ctx.save();
    
    ctx.translate(10,10);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillText('COMPOSITION: ', 0, 15);
    
    ctx.translate(80,0);
    
    var bar_width = 200;
    var bar_start = 0;
    var width;
    
    var type_colors = new Array();
    type_colors[0] = 'rgb(0,255,0)';
    type_colors[1] = 'rgb(0,0,255)';
    
    var out = '';
    
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(-2,-2,bar_width+4, 24);
    
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,bar_width,20);
    
    for (var i=0; i < TYPE_COUNT; i++)
    {
        ctx.fillStyle = TYPE_COLORS[i];
        
        out += worldComp[i] + ' ';
        
        width = (worldComp[i] / worldPix.length) * bar_width;
        
        ctx.fillRect(bar_start, 0, width, 20);
        bar_start += width;
    }
    // output(out + ' | ' + worldPix.length);
    
    ctx.translate(-80,25);
    
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(-4, 0, 200, 14);
    
    for (var i=0; i < TYPE_COUNT; i++)
    {
        ctx.fillStyle = TYPE_COLORS[i];                
        ctx.fillRect(i*50, 0, 10, 10);
        
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillText(TYPE_NAMES[i], i*50+15, 10);
        
    }
    
    
    
    ctx.restore();
}

function drawMessage(message)
{
    ctx.fillStyle = 'rgb(128,128,128)';
    ctx.fillRect(-100,-100, 200, 200);
    
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(-98,-98, 196, 196);
    
    ctx.fillStyle = 'rgb(255,255,255)';
    
    // if (message.length)
    // {
        // array
    var starty = -85;
    for (var i=0; i<message.length; i++)
    {
        ctx.fillText(message[i], -90, starty);
        starty += 10;
    }
    // }
    // else
    // {
        //ctx.fillText(message, -90, -90);
    // }
}

function showLevelDesc()
{
    state = STATE_LEVEL_DESC;
}

function startGame()
{
    state = STATE_PLAY;
    
    worldPix = new Array();
    comets = new Array();
    
    border = new Array();
    borderSize = 8;
    for (var i=0; i<borderSize; i++)
    {
        border[i] = 0;
    }
    
    waitTime = Math.random() * 10;
    worldAngle = 0;
    
    worldSize = levels[currentLevel].startSize;
    
    shieldSize = worldSize + 5;
    
    targetSize = levels[currentLevel].size;
    
    worldComp = new Array();
    for (var i=0; i < TYPE_COUNT; i++)
    {
        worldComp[i] = 0;
    }
}

function render()
{
    // output(worldAngle);
    
    // ctx.fillStyle = 'rgb(0,0,0)';
    // ctx.fillRect(0,0,500,500);

    ctx.drawImage(backImg, 0, 0);

    ctx.save();
    ctx.translate(250,250);
    
    switch (state)
    {
        case STATE_PLAY:
        {
            drawComets();
               
            ctx.save(); // store before rotating
            
            ctx.rotate(worldAngle);
            
            drawWorld();
        
            ctx.restore();  // end rotation of the planet
        
            drawShield();
            
            drawTargetSize();
        }
        break;
        case STATE_LEVEL_DESC:
        {
            drawMessage(levels[currentLevel].startText);
            // drawMessage('Build a world! \n [W] to start');
            break;
        }
        break;
        case STATE_INTRO:
        {
            drawMessage(text_intro);
            
        }
        break;
        case STATE_RESULT:
        {
            if (won)
            {
                drawMessage(['Excellent work!','[W] to continue']);
            }
            else
            {
                drawMessage(['World failed. Try again']);
            }
        }
        break;
        case STATE_BEAT_GAME:
            {
                drawMessage(['AWESOME work, builder!', 'Our customers are very happy.']);
            }
            break;
    }
    ctx.restore();
    
    if (state == STATE_PLAY)
    {
        drawComposition();
    }
}

function output(text)
{
    var o = document.getElementById('output');
    if (o)
    {
        o.innerHTML = text;
    }
}

init();