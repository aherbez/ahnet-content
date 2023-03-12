// var inversions = 0;

var FPS = 1000/30;
var ctx;

var target;
var guess;

var diff;

var SWATCH_SIZE = 40;
var SWATCH_OFFSET_X = 10;
var SWATCH_OFFSET_Y = 10;

var SUBMIT_OFFSET_X = 10;
var SUBMIT_OFFSET_Y = 400 - 10 - SWATCH_SIZE;

var NUM = 8;
var MAX_INV = ~~((NUM * (NUM-1))/2);

var selected = [];
var selectedList = [];
var guesses = [];

function init()
{
    var canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d');
       
    /*     
    selected = [0,0,0,0,0,0,0,0];
    
    target = genTarget();
    
    target = [2,1,3,4,5,6,7,8];
    target = [0,1,2,3,4,5,6,7];
    */
    
    // target = [8,7,6,5,4,3,2,1];
    // guess = [1,2,3,4,5,6,7,8];
    /*
    var a1 = makeRef(target, target);
    var a2 = makeRef(target, guess);
    
    inversions = 0;
    var result = mergeSort(a2);
    */
    // max_inv = (target.length * (target.length-1))/2;
    /*    
    console.log(inversions + ' DIFFERENCES');
    diff = inversions/max_inv;
    */
    
    reset();
    
    setInterval(update, FPS);
    document.onmousedown = onClick;
    
    /*
    console.log('START');
    
    inversions = 0;
    var result = mergeSort(input);
    
    console.log('OUTPUT');
    console.log(result.length);
    
    console.log('SORTED ' + result.length + ' WITH ' + inversions + ' INVERSIONS');
    */
}

function makeRef(reference, input)
{
    var out = [];
    var temp = [];
    
    for (var i=0; i < reference.length; i++)
    {
        temp[reference[i]] = i;
    }
    
    for (var i=0; i < reference.length; i++)
    {
        out[i] = temp[input[i]];
    }
    
    return out;
}

function genTarget()
{
    // console.log('GEN TARGET');
    var t = [0,1,2,3,4,5,6,7];
    var temp;
    var i;
    var j;
    
    for (var k=0; k < 50; k++)
    {
        i = ~~(Math.random() * t.length);        
        j = ~~(Math.random() * t.length);        
    
        temp = t[i];
        t[i] = t[j];
        t[j] = temp;
    
    }
    
    /*
    for (var i=0; i < t.length; i++)
    {
        console.log(t[i]);
    }
    */
    return t;
}


function render()
{
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,600,400);
    
    drawSwatches();
    drawGuesses();
}

function update()
{
    
    render();
}

function drawSwatches()
{
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(128,128,128)';
    
    for (var i=0; i < COLORS.length; i++)
    {
        if (selected[i] == 0)
        {
            ctx.fillStyle = COLORS[i];
        }
        else
        {
            ctx.fillStyle = 'rgb(128,128,128)';
        }
        ctx.fillRect( ((i%2) * (SWATCH_SIZE+5)) + SWATCH_OFFSET_X, (~~(i/2) * (SWATCH_SIZE+5)) + SWATCH_OFFSET_Y, SWATCH_SIZE, SWATCH_SIZE  );
        ctx.strokeRect( ((i%2) * (SWATCH_SIZE+5)) + SWATCH_OFFSET_X, (~~(i/2) * (SWATCH_SIZE+5)) + SWATCH_OFFSET_Y, SWATCH_SIZE, SWATCH_SIZE  );

    }
    
    for (var i=0; i < selectedList.length; i++)
    {
        ctx.fillStyle = COLORS[selectedList[i]];
        ctx.fillRect( i * SWATCH_SIZE + SUBMIT_OFFSET_X, SUBMIT_OFFSET_Y, SWATCH_SIZE, SWATCH_SIZE);
        ctx.strokeRect( i * SWATCH_SIZE + SUBMIT_OFFSET_X, SUBMIT_OFFSET_Y, SWATCH_SIZE, SWATCH_SIZE);
        
    }
    
    ctx.beginPath();
    ctx.moveTo(0, 400-60);
    ctx.lineTo(600, 400-60);
    // ctx.endPath();
    ctx.stroke();
}

function onClick(event)
{
    if (selectedList.length == 8)
    {
        submit();
    }
    
    console.log('CLICK ' + event.pageX + ' ' + event.pageY);
    var x = event.pageX - 10;
    var y = event.pageY - 10;
    
    if (x > (2 * SWATCH_SIZE) + SWATCH_OFFSET_X)
    {
        return;
    }
    if (y > (4 * SWATCH_SIZE) + SWATCH_OFFSET_Y)
    {
        return;
    }
    
    x -= SWATCH_OFFSET_X;
    y -= SWATCH_OFFSET_Y;
    
    x = ~~(x / (SWATCH_SIZE+5));
    y = ~~(y / (SWATCH_SIZE+5));
    
    var i = y*2 + x;
    
    select(i);
}

function select(i)
{
    if (selected[i] == 1)
    {
        return;
    }
    
    selected[i] = 1;
    selectedList.push(i);
    
    if (selectedList.length > 7)
    {
        submit();
    }
}

function submit()
{
    for (var i =0 ; i< selectedList.length; i++)
    {
        console.log(selectedList[i]);
    }
    
    /*
    target = genTarget();    
    target = [2,1,3,4,5,6,7,8];
    // target = [8,7,6,5,4,3,2,1];
    guess = [1,2,3,4,5,6,7,8];
    */
    
    var a1 = makeRef(target, target);
    var a2 = makeRef(target, selectedList);
    
    inversions = 0;
    var result = mergeSort(a2);
    
    if (inversions == 0)
    {
        alert('CORRECT!');
        reset();
        return;
    }
    
    var guess = [];
    guess[0] = [];
    guess[1] = inversions;
    for (var i=0; i < NUM; i++)
    {
        guess[0][i] = selectedList[i];
    }
    guesses.push(guess);
    
    console.log(inversions + ' INVERSTIONS');
    
    selected = [0,0,0,0,0,0,0,0];
    selectedList = [];
}

var MAX_GUESS = 20;

function drawGuesses()
{
    var x_start = 150;
    var y_start = 10;
    var x,y;
    
    var start_guess = 0;
    if (guesses.length > MAX_GUESS)
    {
        start_guess = guesses.length - MAX_GUESS;
    }
    
    var gi;
    
    // for (var i = 0; i < 20; i++)
    for (var i = 0; i < MAX_GUESS; i++)
    {
        if (i+start_guess >= guesses.length)
        {
            return;
        }
        
        x = x_start;
        y = i*30;
        if (i >= 10)
        {
            y -= 300;
            x = 350;
        }
        y += y_start;
        drawGuess(guesses[i+start_guess], x, y);
        /*
        if (i > 9)
        {
            x_start = 350;
            y_start = 0;
        }
        */
    }
}

function drawGuess(guess, x, y)
{
    for (var i=0; i < NUM; i++)
    {
        ctx.fillStyle = COLORS[guess[0][i]];
        ctx.fillRect( i*20 + x, y, 20, 20);
    }
    
    ctx.fillStyle = 'rgb(100,255,100)';
    ctx.fillRect(x, y+22, (20*NUM), 5);
    
    ctx.fillStyle = 'rgb(255,100,100)';
    ctx.fillRect(x, y+22, (20*NUM * (guess[1]/MAX_INV)), 5);
    
    ctx.strokeRect(x, y, (20*NUM), 27);
}

function reset()
{
    guesses = [];
    selected = [0,0,0,0,0,0,0,0];
    selectedList = [];
    target = genTarget();
}
