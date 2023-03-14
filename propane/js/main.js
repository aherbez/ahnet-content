
let canvas, ctx, outputImg;
let width, height;
let flameHeight = 200;
let flameWidth = 50;
let margin = 10;
let radius = 50;

let noteText = "";
let illustration = null;

function init() {
  canvas = document.getElementById("stage");
  ctx = canvas.getContext("2d");
  outputImg = document.getElementById("outputImg");

  let bounds = canvas.getBoundingClientRect();
  width = bounds.width;
  height = bounds.height;

  illustration = new Image();
  illustration.onload = render;

  flameHeight = Math.floor(height/4);
  flameWidth = Math.floor(flameHeight/4);
  console.log(flameWidth);

  render();
}

function handleFile( event )
{
    let selectedFile = event.target.files[ 0 ];
    let reader = new FileReader();

    reader.onload = function( event )
    {
        document.getElementById( "fileBtn" ).blur();

        illustration.src = event.target.result;
        console.log(illustration.src);
        render();
    }
    reader.readAsDataURL( selectedFile );
}

function drawBorder()
{
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#aaa";
  ctx.strokeRect(-1, -1, width+2, height+2);
  ctx.restore();
}

function drawFlame(w, h)
{
  let p0 = [0,0];

  let c1 = [(w/2)-(w/8 * 1.2), h/4];
  let p1 = [(w/2)-(w/4), h/2];

  let p2 = [w/2, h];
  let c2 = [(w/2) - (w/4 * 1.2), h*0.75];

  let p3 = [(w/2)+(w/4), h/2];
  let c3 = [(w/2) - (w/4 * 0.8), h*0.75];

  let p4 = [w, 0];
  let c4 = [(w/2)+(w/2 * 1.2), h/4];

  // ctx.save();
  ctx.moveTo(p0[0], p0[1]);
  ctx.quadraticCurveTo(c1[0], c1[1], p1[0], p1[1]);
  ctx.quadraticCurveTo(c2[0], c2[1], p2[0], p2[1]);
  ctx.quadraticCurveTo(c3[0], c3[1], p3[0], p3[1]);
  ctx.quadraticCurveTo(c4[0], c4[1], p4[0], p4[1]);

  // ctx.stroke();

  // ctx.restore();
}

function drawFlameShape( width, height, flameHeight, color, border = false )
{
  let randWidth, randHeight;

  let currWidth = 0;

  ctx.save();

  ctx.fillStyle = color;
  ctx.strokeStyle = "#D00";
  ctx.beginPath();
  ctx.translate( margin, flameHeight );
  // for (let i=0; i < 4; i++)
  while( ( width - currWidth ) > 100 )
  {
    randWidth = Math.floor( Math.random() * flameWidth + ( flameWidth * 0.4 ) );
    randHeight = Math.floor( ( Math.random() + 0.5 ) * 2 * randWidth )
    if( randHeight > flameHeight ) randHeight = flameHeight;

    drawFlame( randWidth, -randHeight );
    currWidth += randWidth;
    ctx.translate( randWidth, 0 );
  }
  randWidth = ( width - currWidth - ( margin * 2 ) );
  randHeight = Math.floor( ( Math.random() + 0.5 ) * 2 * randWidth )
  if( randHeight > flameHeight ) randHeight = flameHeight;
  drawFlame( randWidth, -randHeight );
  currWidth += randWidth;

  if (border) ctx.stroke();
  
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = "#D00";
  ctx.moveTo( currWidth + margin, flameHeight );
  ctx.lineTo( currWidth + margin, height - radius );
  ctx.quadraticCurveTo( width - margin, height - ( margin / 2 ), width - radius, height - ( margin / 2 ) );

  ctx.lineTo( radius, height - ( margin / 2 ) );
  ctx.quadraticCurveTo( margin, height - ( margin / 2 ), margin, height - radius );

  ctx.lineTo( margin, flameHeight );

  if (border) ctx.stroke();
  ctx.fill();
  ctx.restore();

}

function drawFlames()
{
  let randWidth, randHeight;

  let currWidth = 0;

  ctx.save();

  ctx.fillStyle = "#FCC";
  ctx.strokeStyle = "#D00";
  ctx.beginPath();
  ctx.translate(margin, flameHeight);
  // for (let i=0; i < 4; i++)
  while ((width - currWidth) > 100)
  {
    randWidth = Math.floor(Math.random() * flameWidth + (flameWidth * 0.4));
    randHeight = Math.floor((Math.random() + 0.5) * 2 * randWidth)
    if (randHeight > flameHeight) randHeight = flameHeight;

    drawFlame(randWidth, -randHeight);
    currWidth += randWidth;
    ctx.translate(randWidth, 0);
  }
  randWidth = (width - currWidth - (margin*2));
  randHeight = Math.floor((Math.random() + 0.5) * 2 * randWidth)
  if (randHeight > flameHeight) randHeight = flameHeight;
  drawFlame(randWidth, -randHeight);
  currWidth += randWidth;

  ctx.stroke();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#FCC";
  ctx.strokeStyle = "#D00";
  ctx.moveTo(currWidth+margin, flameHeight);
  ctx.lineTo(currWidth+margin, height-radius);
  ctx.quadraticCurveTo(width-margin, height-(margin/2), width-radius, height-(margin/2));

  ctx.lineTo(radius, height-(margin/2));
  ctx.quadraticCurveTo(margin, height-(margin/2), margin, height-radius);

  ctx.lineTo(margin, flameHeight);

  ctx.stroke();
  ctx.fill();
  ctx.restore();

}

function updateText()
{
  noteText = document.getElementById("noteEl").value;
  render();
}

function drawNote()
{
  ctx.save();

  let r = 20;
  let w = Math.floor( width * 0.8 );
  let h = 50;

  ctx.translate(Math.floor(width*0.1), height-80);
  ctx.fillStyle = "#fff7c2";
  ctx.beginPath();
  ctx.moveTo( r, 0 );
  ctx.lineTo( w - r, 0 );
  ctx.arcTo( w, 0, w, r, r );
  ctx.lineTo( w, h - r );
  ctx.arcTo( w, h, w - r, h, r );
  ctx.lineTo( r, h );
  ctx.arcTo( 0, h, 0, h - r, r );
  ctx.lineTo( 0, r );
  ctx.arcTo( 0, 0, r, 0, r );
  ctx.fill();

  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.translate(width/2, height - 47);
  ctx.fillText(noteText, 0, 0);

  ctx.restore();
}

function drawImage()
{
  if (illustration === null) return;

  let scale = ( width * 0.8 ) / illustration.width;
  
  let newHeight = illustration.height * scale;

  ctx.save();
  ctx.translate(width * 0.1, height - 120 - newHeight);
  ctx.scale(scale, scale);
  ctx.drawImage(illustration, 0, 0);
  ctx.restore();
}

function drawFlameShapeTranslated( offset, fh, color, border = false)
{
  ctx.save();
  ctx.translate( 0, offset );
  drawFlameShape( width, height-offset, fh, color, border );
  ctx.restore();
}


function render()
{
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.lineWidth = 2;

  drawFlameShapeTranslated( 0, 200, "#da4145", true );

  drawFlameShapeTranslated( 250, 100, "#ed7f00");

  drawFlameShapeTranslated( 450, 100, "#f29200");

  drawImage();

  drawFlameShapeTranslated( 650, 50, "#ffe63f");

  /*
  drawFlameShape( width, height, 200, "#da4145", true );

  ctx.translate( 0, 250 );
  drawFlameShape( width, height - 250, 100, "#ed7f00" );
  
  
  ctx.translate(0, 300);
  drawFlameShape( width, height - 300, 100, "#f29200" );

  
  ctx.translate( 0, 150 );
  drawFlameShape( width, height - 650, 50, "#ffe63f" );
  */

  drawNote();
  ctx.restore();
  outputImg.src = canvas.toDataURL("image/png");
}



init();
