class RomanceUI extends CubocoImageGeneratorUI
{
  init()
  {
    this.addFileButton('Load Main Image', 'main');
    this.addColorOption('author color', 'authorTextColor', '#bb3876');
    this.addTextOption('header text', 'headerText', 'Romance Novel');
    this.addTextOption('author', 'authorText', 'Sara Craven');
    this.addTextOption('title', 'titleText', 'the marriage deal');
  }
}


class RomanceCover extends CubocoImgGen
{
  init()
  {
    this.baseWidth = 750;
    this.baseHeight = 1225;

    this.mainImgSize = this.hVal(620);

    this.logoColor = "#b0a353";
    this.baseColor = "#fdf9ed";

    this.topSwirlScale = 1;
    this.botSwirlScale = 1;

    this.imgTopSwirl = new Image();

    this.imgTopSwirl.onload = function() {
      this.topSwirlScale = (this.imgWidth * 0.8) / this.imgTopSwirl.width;
      this.render(this.ctx);
    }.bind(this);
    this.imgTopSwirl.src = "img/top_swirl.png";

    this.imgBotSwirl = new Image();
    this.imgBotSwirl.onload = function() {
      this.botSwirlScale = (this.imgWidth * 0.8) / this.imgBotSwirl.width;

      this.render(this.ctx);
    }.bind(this);
    this.imgBotSwirl.src = "img/bottom_swirl.png";

    this.ui = new RomanceUI(this);

    this.data = {
      'authorText': 'Author name',
      'authorTextColor': '#bb3876',
      'titleText': 'title',
      'headerText': 'Romance Novel'
    };


    this.addFont("romance");
    this.addFont("Champignon");
  }

  render(ctx)
  {
    this.ctx.save();
    this.ctx.fillStyle = this.baseColor;

    this.ctx.fillRect(0, 0, this.imgWidth, this.imgHeight);

    this.performRenderActions([
        this.drawMainImage,
        this.drawImageFrame,
        this.drawCurls,
        this.drawLogo,
        this.drawText
    ])

    ctx.restore();
    // this.drawWaterMark(ctx, 'ROMANCE');
  }

  drawCurls(ctx)
  {
    if (this.imgTopSwirl) {
      ctx.save();

      ctx.translate(this.imgWidth*0.1, this.imgHeight * 0.04);
      ctx.scale(this.topSwirlScale, this.topSwirlScale);
      ctx.drawImage(this.imgTopSwirl, 0, 0);
      ctx.restore();
    }

    if (this.imgBotSwirl) {
      ctx.save();
      ctx.translate(this.imgWidth*0.1, this.imgHeight - this.vVal(150));
      ctx.scale(this.botSwirlScale, this.botSwirlScale);
      ctx.drawImage(this.imgBotSwirl, 0, 0);
      ctx.restore();
    }

  }

  drawImageFrame(ctx)
  {
    ctx.save();

    ctx.fillStyle = this.baseColor;
    ctx.beginPath();
    ctx.rect(0, 0, this.imgWidth, this.imgHeight);
    ctx.arc(this.imgWidth/2, this.vVal(760), this.hVal(305), Math.PI * 2, 0);
    ctx.closePath();
    ctx.fill("evenodd");

    ctx.strokeStyle = this.logoColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(this.imgWidth/2, this.vVal(760), this.hVal(325), 0, Math.PI * 2);
    ctx.arc(this.imgWidth/2, this.vVal(760), this.hVal(315), 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.hVal(20), this.vVal(360));
    ctx.lineTo(this.imgWidth-this.hVal(20), this.vVal(360));
    ctx.stroke();

    ctx.restore();
  }

  drawMainImage(ctx)
  {
    let img = this.getImage('main');
    if (img !== null)
    {
      ctx.save();

      let sourceDimensions = this.croppedImageDimensions(img, this.mainImgSize, this.mainImgSize);

      ctx.translate(this.hVal(70),this.vVal(450));

      let x = Math.floor((img.width-sourceDimensions[0])/2);
      let y = Math.floor((img.height-sourceDimensions[1])/2);

      ctx.drawImage(img,
          x, y,
          sourceDimensions[0], sourceDimensions[1],
          0, 0,
          this.mainImgSize, this.mainImgSize);

      ctx.restore();
    }
  }

  drawLogo(ctx)
  {
    ctx.save();

    ctx.strokeStyle = this.baseColor;
    ctx.fillStyle = this.logoColor;

    ctx.lineWidth = 10;

    ctx.translate(this.imgWidth/2, 80);
    ctx.beginPath();
    ctx.moveTo(0, 72);
    ctx.lineTo(43, 0);
    ctx.lineTo(0, -72);
    ctx.lineTo(-43, 0);
    ctx.lineTo(0, 72);
    ctx.fill();
    ctx.stroke();

    ctx.restore();


    ctx.save();

    if (this.data.headerText)
    {
      ctx.fillStyle = "#000";
      ctx.font = `80px Champignon`;
      ctx.textAlign = "center";
      ctx.fillText(this.data.headerText, this.imgWidth/2, 150);
    }

    ctx.restore();
  }


  drawText(ctx)
  {
    ctx.save();

    ctx.font = `${200}px romance`;

    if (this.data.authorText)
    {
      ctx.save();

      let author = this.data.authorText.toUpperCase();
      author = author.split(" ");

      ctx.fillStyle = this.data.authorTextColor || "#000";
      ctx.font = `${100}px romance`;
      ctx.textAlign = "center";

      let totalHeight = (author.length * 80);
      let s = 1;
      if (totalHeight > 200)
      {
        s = 200 / totalHeight;
        totalHeight = 200;
      }

      ctx.translate(this.imgWidth/2, 430-totalHeight);
      ctx.scale(s, s);

      author.forEach((part,i) => {
        ctx.fillText(part, 0, (i*80));
      });

      ctx.restore();
    }

    if (this.data.titleText)
    {
      let title = this.data.titleText.toLowerCase();

      ctx.save();
      ctx.font = `${80}px romance`;
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";

      let metrics = ctx.measureText(title);

      let titleScale = 1;
      if (metrics.width > this.imgWidth * 0.9) {
        titleScale = (this.imgWidth * 0.9) / metrics.width;
      }

      ctx.translate(this.imgWidth/2, 420);
      ctx.scale(titleScale, 1);
      ctx.fillText(title, 0, 0);

      ctx.restore();
    }

    ctx.restore();
  }

}
