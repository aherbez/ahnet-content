/*

send to charles@ubiquity6.com

*/

const CELLS_WIDE = 8;
const CELLS_HEIGHT = 6;
const CELL_SIZE = 100;

const HALF_CELL = CELL_SIZE / 2;

let canvast;
let ctx;

let gameGrid = [];

let block = {
    x: (1 * CELL_SIZE), // HALF_CELL,
    y: (3 * CELL_SIZE),
    xVel: 10,
    yVel: 10
};

// let walls = [];

let walls = [
    [6, 0],
    [1, 1],
    [3, 2],
    [6, 4],
    [1,5]
];

let dirOffsets = [
    [0, -1],        // up
    [1, 0],         // right
    [0, 1],         // down
    [-1, 0]         // left
]

let cWidth, cHeight;


function init()
{
    canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d');

    let bounds = canvas.getBoundingClientRect();
    cWidth = bounds.width;
    cHeight = bounds.height;

    for (let row=0; row < CELLS_HEIGHT; row++)
    {
        gameGrid[row] = [];
        for (let col=0; col < CELLS_WIDE; col++)
        {
            gameGrid[row][col] = 0;

            // if (col > 2) gameGrid[row][col] = 1;
        }
    }

    console.log(cWidth/CELL_SIZE, cHeight/CELL_SIZE);

    walls.forEach(w =>{
        console.log(w);
        gameGrid[w[1]][w[0]] = 1;
    });
    

    requestAnimationFrame(update);
}   

function collideRight(pos)
{
    return collide(pos, 1)
}

function collideHoriz(pos)
{
    // checking right side
    if (inOccupiedCell({
        x: pos.x + HALF_CELL,
        y: pos.y})) {
            return true;
        }
    
    // checking left side 
    if (inOccupiedCell({
        x: pos.x - HALF_CELL,
        y: pos.y
    })) {
        return true;
    }

    return false;
}

function collideCorders(pos)
{
    if (inOccupiedCell({
        x: pos.x + HALF_CELL,
        y: pos.y})) {
            return true;
        }
    
}

function collideVert(pos)
{
    if (inOccupiedCell({
        x: pos.x,
        y: pos.y + (CELL_SIZE/2)})) {
            return true;
        }
    
    if (inOccupiedCell({
        x: pos.x,
        y: pos.y - (CELL_SIZE/2)
    })) {
        return true;
    }

    return false;
}



// input: position, in pixels
function inOccupiedCell(pos)
{

    let gridX = Math.floor(pos.x / CELL_SIZE);
    let gridY = Math.floor(pos.y / CELL_SIZE);

    if (gridX < 0 || gridX >= CELLS_WIDE) return true;
    if (gridY < 0 || gridY >= CELLS_HEIGHT) return true;

    return (gameGrid[gridY][gridX] != 0);
}


function inCell(pos, dir)
{
     

}

function testCollision()
{
    let newPos = {
        x: block.x + block.xVel,
        y: block.y + block.yVel
    };
    
    let hit = inOccupiedCell(newPos);

    let diffX, diffY;
    if (hit)
    {   
        diffX = newPos.x - block.x;
        diffY = newPos.y - block.y;



    }
}


function updateBlock()
{
    // get new position for cube

    let newPos = {
        x: block.x + block.xVel,
        y: block.y + block.yVel,
    }

    let didHit = false;

    if (collideHoriz(newPos)) {
        // block.x += offset;
        // didHit = true;

        block.xVel *= -1;
    }

    if (collideVert(newPos)) {
        // block.y += offset;
        block.yVel *= -1;
        // didHit = true;
    }

    if (!didHit)
    {
        block.x = block.x + block.xVel;
        block.y = block.y + block.yVel;
    }

}

function drawGrid() {
    ctx.clearRect(0, 0, cWidth, cHeight);

    ctx.save();

    ctx.beginPath();
    ctx.strokeStyle = "#444";

    for (let i = 1; i < CELLS_WIDE + 1; i++)
    {
        ctx.moveTo(i*CELL_SIZE, 0);
        ctx.lineTo(i*CELL_SIZE, cHeight);
        ctx.stroke();
    }

    for (let i = 1; i < CELLS_HEIGHT + 1; i++)
    {
        ctx.moveTo(0, i*CELL_SIZE);
        ctx.lineTo(cWidth, i*CELL_SIZE);
        ctx.stroke();
    }

    ctx.restore();

    for (let r=0; r < CELLS_HEIGHT; r++)
    {
        for (let c=0; c < CELLS_WIDE; c++)
        {
            if (gameGrid[r][c] != 0)
            {
                ctx.fillRect( c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

}

function drawBox() {

    ctx.save();

    ctx.translate(block.x, block.y);

    ctx.fillStyle = '#00FF00';

    ctx.fillRect(-HALF_CELL, 
        -HALF_CELL, 
        CELL_SIZE, 
        CELL_SIZE);

    ctx.restore();
}

function update(dt)
{
    ctx.clearRect(0, 0, cWidth, cHeight);

    // console.log('updating');
    // console.log(block);

    updateBlock();

    drawGrid();
    drawBox();

    requestAnimationFrame(update);
}


init();
