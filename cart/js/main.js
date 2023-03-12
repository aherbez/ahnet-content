
let canvas, ctx, outputImg;
let width, height;
let logoHeight = 60;
let logoColor = 'rgb(200,200,200)';

let backImg;

let mainImg;

let noteText = "";
let illustration = null;

let logoWidth = 0;

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

  backImg = new Image();
  backImg.src = 'img/background2.png';

  mainImg = new Image();
  mainImg.src = 'img/mario.png';

  render();
}

function handleFile( event )
{
    let selectedFile = event.target.files[ 0 ];
    let reader = new FileReader();

    reader.onload = function( event )
    {
        document.getElementById( "fileBtn" ).blur();

        mainImg.src = event.target.result;
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

function drawNote()
{
  ctx.save();

  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.translate(width/2, height - 25);
  ctx.fillText(noteText, 0, 0);

  ctx.restore();
}

function drawImage()
{
  if (illustration === null) return;

  let scale = (width - (margin*4)) / illustration.width;
  ctx.save();
  ctx.translate(margin*2, flameHeight + margin);
  ctx.scale(scale, scale);
  ctx.drawImage(illustration, 0, 0);
  ctx.restore();
}

function drawText()
{
  let text = document.getElementById("mainText").value;

  ctx.save();
  ctx.translate(width/2, height/2 + 100);
  ctx.fillStyle = document.getElementById("textColor").value;
  ctx.font = `100px hvbo`;
  ctx.textAlign = "center";

  ctx.rotate((-10/180)*Math.PI);
  ctx.fillText(text, 0,0);

  ctx.restore();
}

function drawLogo()
{
  let logoText = document.getElementById("logoText").value;
  logoColor = document.getElementById("logoColor").value;

  ctx.save();
  ctx.translate(100, 750);

  ctx.fillStyle = logoColor;
  ctx.strokeStyle = logoColor;
  ctx.lineWidth = 5;

  ctx.font = `30px pretendo`;
  ctx.textAlign = "left";

  ctx.rotate((-10/180)*Math.PI);
  ctx.fillText(logoText, 10, logoHeight/2+10);

  let metrics = ctx.measureText(logoText);

  logoWidth = metrics.width + 175;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(metrics.width + 20, 0);
  ctx.arc(metrics.width + 20, logoHeight/2, logoHeight/2, Math.PI * 1.5, Math.PI/2);

  ctx.lineTo(metrics.width + 20, logoHeight);
  ctx.lineTo(0, logoHeight);
  ctx.arc(0, logoHeight/2, logoHeight/2, Math.PI/2, Math.PI * 1.5);

  ctx.stroke();

  ctx.restore();
}

function drawSecondText()
{

  let text = document.getElementById("secondText").value;
  let tColor = document.getElementById("textColor2").value;

  ctx.save();

  ctx.fillStyle = tColor;
  ctx.translate(logoWidth, 690);
  ctx.font = `30px hvbo`;
  ctx.textAlign = "left";

  ctx.rotate((-10/180)*Math.PI);
  ctx.fillText(text, 0, logoHeight/2+10);

  ctx.restore();

}

function drawArt()
{
  let artWidth = 647;
  let artHeightR = 445;
  let artHeightL = 552;

  ctx.save();
  ctx.translate(85, 80);

  ctx.fillStyle = 'rgb(255, 255, 255)';


  if (mainImg)
  {
    ctx.save();

    let s = artWidth / mainImg.width;

    ctx.scale(s, s);
    ctx.drawImage(mainImg, 0, 0);

    ctx.restore();

  }


  // ctx.globalCompositeOperation = "soure-over";

  // ctx.globalCompositeOperation = "destination-in";
  /*
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(artWidth, 0);
  ctx.lineTo(artWidth, artHeightR);
  ctx.lineTo(0, artHeightL);
  ctx.fill();
  */

  ctx.restore();
}

function drawSeal()
{
  let sealR = 110;

  ctx.save();
  ctx.translate(620, 960);

  let sealColor = document.getElementById("sealColor").value;
  let sealText = document.getElementById("sealText").value;

  ctx.strokeStyle = sealColor;
  ctx.fillStyle = sealColor;
  ctx.lineWidth = 20;

  ctx.beginPath();
  ctx.arc(0, 0, sealR, 0, Math.PI*2);
  ctx.stroke();

  let n = 50;
  for (let i=0; i < n; i++)
  {
    ctx.save();
    ctx.rotate(i * (Math.PI * 2 / n));
    ctx.beginPath();
    ctx.moveTo(sealR-2, -10);
    ctx.lineTo(sealR+30, 0);
    ctx.lineTo(sealR-2, 10);
    ctx.fill();
    ctx.restore();
  }

  ctx.font = '24px hvbld';
  ctx.textAlign = "center";

  let parts = sealText.split("\n");

  ctx.save();

  ctx.translate(0, parts.length*-12+24)

  parts.forEach(line => {
    ctx.fillText(line, 0, 0);
    ctx.translate(0, 24);
  })
  ctx.restore();

  ctx.restore();
}

function render()
{
  ctx.clearRect(0, 0, width, height);



  ctx.save();

  ctx.fillStyle = 'rgb(200,200,200)';
  ctx.fillRect(0, 0, width, height);

  drawArt();
  ctx.drawImage(backImg, 0, 0);

  drawText();

  drawLogo();

  drawSecondText();

  drawSeal();

  ctx.restore();
  outputImg.src = canvas.toDataURL("image/png");

  requestAnimationFrame(render);
}



init();
