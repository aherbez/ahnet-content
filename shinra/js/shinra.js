class ShinraUI extends CubocoImageGeneratorUI
{
  init()
  {
    this.addTextAreaOption('Text', 'descText', '');
  }
}


class ShinraGamebox extends CubocoImgGen
{
  init()
  {
    this.baseWidth = 1200;
    this.baseHeight = 840;

    this.background = new Image();
    this.background.src = './img/background1.jpg';
    this.background.onload = this._maybeUpdate.bind(this);

    this.addFont("ff7");

    this.mainImgW = this.hVal(1200);
    this.mainImgH = this.vVal(840);

    this.ui = new ShinraUI(this);

    this.data = {
        descText: "Fuck \nJeff \nBezos"
    };

    this.renderActions = [
      this.drawBackground,
      this.drawText,
    ];
  }

  drawBackground(ctx)
  {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.imgWidth, this.imgHeight);
    ctx.drawImage(this.background, 0, 0);
  }

  /*
  drawMainImage(ctx)
  {
    let img = this.getImage('main');
    if (img !== null)
    {
      ctx.save();

      let sourceDimensions = this.croppedImageDimensions(img, this.mainImgW, this.mainImgH);

      ctx.translate(this.hVal(80),this.vVal(80));

      let x = Math.floor((img.width-sourceDimensions[0])/2);
      let y = Math.floor((img.height-sourceDimensions[1])/2);

      ctx.drawImage(img,
          x, y,
          sourceDimensions[0], sourceDimensions[1],
          0, 0,
          this.mainImgW, this.mainImgH);

      ctx.restore();
    }
    else {
      ctx.strokeStyle = "rgb(128, 128, 128)";
      ctx.lineWidth = this.hVal(10);

      ctx.beginPath();
      ctx.moveTo(this.hVal(80), this.vVal(80));
      ctx.lineTo(this.imgWidth-this.hVal(80), this.vVal(80));
      ctx.lineTo(this.imgWidth-this.hVal(80), this.vVal(530));
      ctx.lineTo(this.hVal(80), this.vVal(630));
      ctx.lineTo(this.hVal(80), this.vVal(80));
      ctx.stroke();
    }
  }
  */

  drawText(ctx)
  {
    ctx.save();

    ctx.translate(40, 600);

    let fontSize = this.vVal(80);
    let fontSpacing = this.vVal(2);
    let lineHeight = fontSize; // + fontSpacing;
    lineHeight = this.vVal(40);

    ctx.fillStyle = "#FFFFFF";

    if (this.data.hasOwnProperty('descText'))
    {
      let parts = this.data.descText.split("\n");
      console.log(`drawing ${parts}`);

      ctx.font = `${fontSize}px ff7`;

      ctx.save();
      ctx.translate(6,6);

    ctx.fillStyle = "#000000";

      parts.forEach(line => {
        let lines = this.drawWrappedText(line, 1100, lineHeight);
        ctx.translate(0, lines * lineHeight);
      });
      ctx.restore();

      parts.forEach(line => {
        let lines = this.drawWrappedText(line, 1100, lineHeight);
        ctx.translate(0, lines * lineHeight);
      });

    }

    ctx.restore();
  }

}
