class ChildCareUI extends CubocoImageGeneratorUI
{
  init()
  {
    this.addColorOption('Background Color', 'backColor', '#000000');
    this.addFileButton('Load Main Image', 'main');
    this.addColorOption('Border Color', 'borderColor', '#000000');
    this.addTextOptionGroup('Header Text', 'logoText', 3,  ['The', 'Baby-Sitters', 'Club']);
    this.addTextOption('Title Text', 'titleText');
    this.addTextAreaOption('Subtitle Text', 'subtitleText');
    this.addTextOption('Author Text', 'authorText');
    this.addTextOption('Bottom Text', 'bottomText');
  }
}


class ChildCare extends CubocoImgGen
{
  init()
  {
    this.ui = new ChildCareUI(this);

    this.baseWidth = 1200;
    this.baseHeight = 1750;

    this.cubeSizes = [this.hVal(100), this.hVal(80)];
    this.logoFontSizes = [this.vVal(90), this.vVal(70)];
    this.blockW = this.hVal(40);
    this.blockH = this.vVal(30);
    this.blockSepW = this.hVal(4);

    this.mainImgW = this.hVal(1020);
    this.mainImgH = this.vVal(1020);

    this.data = {
      logoText: ['The', 'BabySitters', 'Club'],
      backColor: '#a3cbe5',
      borderColor: '#13579e',
      titleText: 'Hello, Mallory',
      authorText: 'Ann M. Martin',
      bottomText: 'Scholastic',
      numberText: '#14',
      subtitleText: 'Why are the babysitters making it so hard for Mallory to join their club?'
    };

    this.addFont('oswaldblack');
    this.addFont('acre-medium');

    this.renderActions = [
      this.drawBackground,
      this.drawMainImage,
      this.drawLogo,
      this.drawTitleText,
      this.drawAuthorText,
      this.drawSubtext
    ];
  }

  drawTitleText(ctx)
  {
    let fontSize = this.vVal(85);

    ctx.font = `${fontSize}px acre-medium`;

    ctx.fillStyle = this.data.borderColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.translate(this.imgWidth/2, this.vVal(1476));
    ctx.fillText(this.data.titleText, 0, 0);
  }

  drawAuthorText(ctx)
  {
    let fontSize = this.vVal(50);

    ctx.font = `${fontSize}px acre-medium`;

    ctx.fillStyle = '#000';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.translate(this.imgWidth/2, this.vVal(1600));
    ctx.fillText(this.data.authorText, 0, 0);
  }

  drawSubtext(ctx)
  {
    if (this.data.hasOwnProperty('subtitleText'))
    {
      let fontSize = this.vVal(40);
      ctx.font = `${fontSize}px acre-medium`;
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = this.hVal(2);

      let lines = this.wrapText(this.data.subtitleText, this.hVal(640));
      console.log(lines);
      ctx.translate(this.hVal(124), this.vVal(1366));
      ctx.translate(0, -(lines.length * fontSize));

      lines.forEach(line => {
          ctx.fillText(line, 0, 0);
          ctx.strokeText(line, 0, 0);
          ctx.translate(0, fontSize);
      });
    }
  }


  drawBackground(ctx)
  {
    ctx.fillStyle = this.data.backColor;
    ctx.fillRect(0, 0, this.imgWidth, this.imgHeight);
  }

  _isCap(char)
  {
    if (char.charCodeAt)
    {
      let charCode = char.charCodeAt();
      return (charCode > 64 && charCode < 91);
    }
    return false;
  }

  _isLetter(char)
  {
    if (char === " ") return false;
    if (char === "-") return false;

    return true;
  }

  _getTotalTextWidth(s)
  {
    let width = 0;
    s.split("").forEach((c,i) => {
      width += this._isCap(c) ? this.cubeSizes[0] : this.cubeSizes[1];
      if (i != s.length-1) {
        width += this.blockSepW;
      }
    });
    return width;
  }

  _drawLetterText(ctx, char)
  {
    let isCap = this._isCap(char);
    let cubeSize = isCap ? this.cubeSizes[0] : this.cubeSizes[1];
    let fontSize = isCap ? this.logoFontSizes[0] : this.logoFontSizes[1]; // this.vVal(70) : this.vVal(50);
    let tGap = isCap ? this.hVal(5) : this.hVal(4);

    ctx.save();
    ctx.font = `${fontSize}px oswaldblack`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = '#000';

    let cUpper = char.toUpperCase();
    let metrics = ctx.measureText(cUpper);

    for (let i=0; i<tGap; i++)
    {
      ctx.fillText(cUpper, cubeSize/2-i, cubeSize/2+i);
    }

    ctx.fillStyle = '#c02428';
    ctx.fillText(cUpper, cubeSize/2, cubeSize/2);
    ctx.restore();

    return {
      drawWidth: Math.floor(metrics.width * 1.2)
    };
  }

  _drawLogoLetter(ctx, char, isFirst)
  {
    ctx.save();
    let isCap = this._isCap(char);
    let cubeSize = isCap ? this.cubeSizes[0] : this.cubeSizes[1];
    let innerSquareSize = isCap ? this.hVal(86) : this.hVal(70);
    let fontSize = isCap ? this.logoFontSizes[0] : this.logoFontSizes[1]; // this.vVal(70) : this.vVal(50);
    let innerSqOffset = (cubeSize - innerSquareSize)/2;
    let tGap = isCap ? this.hVal(5) : this.hVal(4);

    let blockSideGrad = ctx.createLinearGradient(0, 0, -this.blockW, cubeSize + this.blockH);
    blockSideGrad.addColorStop(0, "#cb7832");
    blockSideGrad.addColorStop(1, "#e6a03e");

    let blockBotGrad = ctx.createLinearGradient(cubeSize/2, cubeSize, cubeSize - this.blockW, cubeSize + this.blockH);
    blockBotGrad.addColorStop(0, "#933914");
    blockBotGrad.addColorStop(1, "#c16e2c");

    let centralGrad = ctx.createLinearGradient(cubeSize/2, cubeSize, cubeSize/2, cubeSize * 0.1);
    centralGrad.addColorStop(0, "#f39c32");
    centralGrad.addColorStop(1, "#f3ba6d");

    ctx.translate(-cubeSize, -(cubeSize/2));

    ctx.save();
    ctx.fillStyle = blockSideGrad; // '#00FF00';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-this.blockW, this.blockH);
    ctx.lineTo(-this.blockW, this.blockH + cubeSize);
    ctx.lineTo(0, cubeSize);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = blockBotGrad; // '#0000FF';
    ctx.beginPath();
    ctx.moveTo(0, cubeSize);
    ctx.lineTo(-this.blockW, cubeSize + this.blockH);
    ctx.lineTo(cubeSize - this.blockW, cubeSize + this.blockH);
    ctx.lineTo(cubeSize, cubeSize);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // base blue square
    ctx.save();
    ctx.fillStyle = '#4b87a9';
    ctx.beginPath();
    ctx.fillRect(0, 0, cubeSize, cubeSize);
    ctx.closePath();
    ctx.restore();

    // interior yellow gradient square
    ctx.save();
    ctx.fillStyle = centralGrad; // '#e6b558';
    ctx.fillRect(innerSqOffset, innerSqOffset, innerSquareSize, innerSquareSize);
    ctx.fill();
    ctx.restore();

    // dark blue lines along top and right edges of interior square
    ctx.save();
    ctx.strokeStyle = '#2b4b7c';
    let lnW = this.vVal(6);
    ctx.lineWidth = lnW;
    ctx.beginPath();
    ctx.moveTo(innerSqOffset, innerSqOffset+(lnW/2));
    ctx.lineTo(innerSqOffset + innerSquareSize, innerSqOffset+(lnW/2));
    ctx.lineTo(innerSqOffset + innerSquareSize, innerSqOffset+innerSquareSize);
    ctx.stroke();
    ctx.restore();

    // this._drawLetterText(ctx, char, cubeSize, tGap, fontSize);
    this._drawLetterText(ctx, char);

    if (!isFirst)
    {
      ctx.save();
      ctx.strokeStyle = "#642e0c";
      ctx.lineWidth = this.hVal(4);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, cubeSize);
      ctx.lineTo(-this.blockW, cubeSize+this.blockH);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();

    return {
      drawnWidth: (cubeSize)
    };
  }

  _drawLogoLine(ctx, s, ypos)
  {
    ctx.save();
    let totalWidth = this._getTotalTextWidth(s);

    ctx.translate((this.imgWidth+totalWidth)/2, ypos);

    let drawnDistance;
    let reverseString = s.split("").reverse().join("");

    let isFirst;
    for (let i=0; i < reverseString.length; i++)
    {
      isFirst = (i === reverseString.length-1);

      if (this._isLetter(reverseString[i]))
      {
        drawnDistance = this._drawLogoLetter(ctx, reverseString[i], isFirst);
      }
      else
      {
        // drawnDistance = this._drawLogoLetter(ctx, reverseString[i], isFirst);
        drawnDistance = this._drawLetterText(ctx, reverseString[i]);
      }


      ctx.translate(-drawnDistance.drawnWidth, 0);
    }
    ctx.restore();
  }

  drawMainImage(ctx)
  {
    ctx.save();
    ctx.translate(this.hVal(95),this.vVal(358));

    let img = this.getImage('main');
    if (img != null)
    {

      let sourceDimensions = this.croppedImageDimensions(img, this.mainImgW, this.mainImgH);
      let x = Math.floor((img.width-sourceDimensions[0])/2);
      let y = Math.floor((img.height-sourceDimensions[1])/2);

      ctx.drawImage(img,
          x, y,
          sourceDimensions[0], sourceDimensions[1],
          0, 0,
          this.mainImgW, this.mainImgH);

    }
    else
    {
      ctx.fillStyle = 'rgb(128,128,128)';
      ctx.fillRect(0, 0, this.mainImgW, this.mainImgH);
    }

    ctx.strokeStyle = this.data.borderColor;
    ctx.lineWidth = this.hVal(10);

    ctx.strokeRect(0, 0, this.mainImgW, this.mainImgH);

    ctx.restore();

  }

  drawLogo(ctx)
  {
    this._drawLogoLine(ctx, this.data.logoText[0], this.vVal(100));
    this._drawLogoLine(ctx, this.data.logoText[1], this.vVal(215));
    this._drawLogoLine(ctx, this.data.logoText[2], this.vVal(327));
  }


}
