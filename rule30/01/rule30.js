var ctx;

var GRID_WIDTH = 10;
var CELL_SIZE = 20;
var grid;
var offsetX = 50;
var mouseOver = -1;

// 30 = 16 + 8 + 4 + 2
var RULES = new Array();
RULES[0] = false;   // 1
RULES[1] = true;    // 2
RULES[2] = true;    // 4
RULES[3] = true;    // 8
RULES[4] = true;    // 16
RULES[5] = false;    // 32
RULES[6] = false;    // 64
RULES[7] = false;    // 128

var current = 1;

function init()
{
    var canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d');

    grid = new Array();
    grid[0] = new Array();
    grid[1] = new Array();
    for (var i=0; i<GRID_WIDTH; i++)
    {
        grid[0][i] = Math.random() * 2 > 1;
        grid[1][i] = false;
    }

    document.onmousedown = handleClick;
    document.onmousemove = mouseMove;
    
    setInterval(update, 1000/30)
}

function handleClick(event)
{
    var x = event.clientX - 10 - offsetX;
    var y = event.clientY - 10;
    
    x = ~~(x / CELL_SIZE);
    y = ~~(y / CELL_SIZE);
    
    if (y == current)
    {
        if (x < GRID_WIDTH)
        {
            grid[y][x] = !grid[y][x];
        }
    }
}

function mouseMove(event)
{
    var x = event.clientX - 10 - offsetX;
    var y = event.clientY - 10;
    
    x = ~~(x / CELL_SIZE);
    y = ~~(y / CELL_SIZE);

    if (y == current && x > -1 && x < GRID_WIDTH)
    {
        mouseOver = x;
    }
    else
    {
        mouseOver = -1;
    }
}

function checkCurrent()
{    
    var correct = true;
    var test = 0;
    var prev, next;
    for (var i=0; i<GRID_WIDTH; i++)
    {
        test = 0;
        
        prev = i-1;
        if (prev < 0) prev = GRID_WIDTH - 1;
        next = i + 1;
        if (next == GRID_WIDTH) next = 0;
        
        if (grid[current-1][next]) test += 1;
        if (grid[current-1][i]) test += 2;
        if (grid[current-1][prev]) test += 4;
        
        if (grid[current][i] != RULES[test]) return false;
    }
    return true;
}

function AddRow()
{
    current++;
    grid[current] = new Array();
    for (var i=0; i < GRID_WIDTH; i++)
    {
        grid[current][i] = false;
    }
}

function update()
{    
    // check to see if the current row is correct
    var correct = checkCurrent();
    if (correct)
    {
        AddRow();
    }
    render();
}

function render()
{
    ctx.clearRect(0,0,700,700);
    
    ctx.fillStyle = 'rgb(128,128,128)';
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.lineWidth = 1;
    for (var i=0; i<grid.length; i++)
    {
        if (i == current-1)
        {
            if (grid[i][0])
            {
                ctx.fillRect((GRID_WIDTH)*CELL_SIZE + offsetX, i*CELL_SIZE, CELL_SIZE, CELL_SIZE); 
            }
            ctx.strokeRect((GRID_WIDTH)*CELL_SIZE + offsetX, i*CELL_SIZE, CELL_SIZE, CELL_SIZE);
            
            if (grid[i][GRID_WIDTH-1])
            {
                ctx.fillRect((-1)*CELL_SIZE + offsetX, i*CELL_SIZE, CELL_SIZE, CELL_SIZE); 
            }
            ctx.strokeRect((-1)*CELL_SIZE + offsetX, i*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        
        for (var j=0; j<grid[i].length; j++)
        {
            if (grid[i][j])
            {
                ctx.fillRect(j*CELL_SIZE + offsetX, i*CELL_SIZE, CELL_SIZE, CELL_SIZE); 
            }
            ctx.strokeRect(j*CELL_SIZE + offsetX, i*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
    
    // render hint
    ctx.strokeStyle = 'rgb(0,0,255)';
    ctx.lineWidth = 3;
    if (mouseOver != -1)
    {
        ctx.strokeRect((mouseOver-1)*CELL_SIZE + offsetX, (current-1)*CELL_SIZE, CELL_SIZE*3, CELL_SIZE);
    }
}