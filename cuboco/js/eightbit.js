class EightbitUI extends CubocoImageGeneratorUI
{
  init()
  {
    this.addFileButton('Load Main Image', 'main');
    this.addTextOption('Main Text', 'mainText', '');
    this.addTextOption('Secondary Text', 'secondText', '');
    this.addColorOption('Logo Color', 'logoColor', '#cb0303');
    this.addTextOption('Logo Text', 'logoText', '');
    this.addColorOption('Seal Color', 'sealColor', '#bc7614');
    this.addTextAreaOption('Seal Text', 'sealText', '');
    this.addColorOption('Main Text Color', 'mainTextColor', '#89ac1c');
    this.addTextOption('Main Text', 'mainText', '');
    this.addColorOption('Secondary Text Color', 'secondaryTextColor', '#faac02');
    this.addTextOption('Secondary Text', 'secondaryText', '');
  }
}


class EightbitGamebox extends CubocoImgGen
{
  init()
  {
    this.baseWidth = 800;
    this.baseHeight = 1140;

    this.mainImgW = (this.imgWidth - this.hVal(160));
    this.mainImgH = this.vVal(560);

    this.ui = new EightbitUI(this);

    this.logoWidth = this.hVal(200);
    this.logoHeight = this.vVal(60);

    this.data = {
      logoColor: '#cb0303',
      logoText: 'Cuboco',
      mainTextColor: '#89ac1c',
      mainText: 'MAIN TEXT',
      secondaryTextColor: '#faac02',
      sealColor: '#bc7614'
    }

    this.textAngle = -Math.atan2(110, 650);

    this.starLocations = [
      [337, 21, 2],
      [765, 387, 1],
      [768, 457, 2]
      [720, 545, 0],
      [729, 590, 2],
      [218, 833, 1],
      [784, 845, 3],
      [475, 836, 1],
      [440, 874, 2],
      [370, 906, 2],
      [732, 886, 2],
      [355, 931, 0],
      [34, 1004, 3],
      [531, 1040, 1],
      [17, 1059, 0],
      [532, 1037, 0]
      [541, 1092, 1],
      [636, 1115, 1]
    ];

    this.addFont("pretendo");
    this.addFont("hvbo");

    this.renderActions = [
      this.drawBackground,
      this.drawMainImage,
      this.drawFrame,
      this.drawStars,
      this.drawSeal,
      this.drawText,
      this.drawLogo,
      this.drawSecondText,
      this.drawNote
    ];
  }

  drawBackground(ctx)
  {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.imgWidth, this.imgHeight);
  }

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

  drawFrame(ctx)
  {
    ctx.fillStyle = "#000";

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.imgWidth, 0);
    ctx.lineTo(this.imgWidth, this.imgHeight);
    ctx.lineTo(0, this.imgHeight);
    ctx.lineTo(0, 0);

    ctx.moveTo(this.hVal(80), this.vVal(80));
    ctx.lineTo(this.imgWidth-this.hVal(80), this.vVal(80));
    ctx.lineTo(this.imgWidth-this.hVal(80), this.vVal(530));
    ctx.lineTo(this.hVal(80), this.vVal(630));
    ctx.lineTo(this.hVal(80), this.vVal(80));

    ctx.fill("evenodd");
  }

  drawStars(ctx)
  {
    ctx.fillStyle = "#FFF";

    let starSizes = [1, 4, 6, 10];

    let gradients = [];

    starSizes.forEach(val => {
      let grd = ctx.createRadialGradient(0, 0, 0, 0, 0, val);
      grd.addColorStop(0, "white");
      grd.addColorStop(1, "black");

      gradients.push(grd);
    });

    this.starLocations.forEach(data => {
      ctx.save();
      ctx.fillStyle = gradients[data[2]];

      ctx.translate(this.hVal(data[0]), this.hVal(data[1]))
      ctx.beginPath();

      ctx.arc(0, 0, this.hVal(starSizes[data[2]]), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  drawNote(ctx)
  {
    if (this.data.noteText)
    {
      let fontSize = this.vVal(20);
      ctx.font = `${fontSize}px arial`; // "20px Arial";
      ctx.textAlign = "center";
      ctx.translate(this.imgWidth/2, this.imgHeight - this.vVal(25));
      ctx.fillText(this.data.noteText, 0, 0);
    }
  }

  drawImage(ctx)
  {
    if (illustration === null) return;

    let scale = (width - (margin*4)) / illustration.width;
    ctx.translate(margin*2, flameHeight + margin);
    ctx.scale(scale, scale);
    ctx.drawImage(illustration, 0, 0);
  }

  drawText(ctx)
  {
    // let text = document.getElementById("mainText").value;
    if (!this.data.hasOwnProperty('mainText') ||
        !this.data.hasOwnProperty('mainTextColor')) return;

    let fontSize = this.vVal(100);

    ctx.translate(this.imgWidth/2, this.imgHeight/2 + this.vVal(100));
    ctx.fillStyle = this.data.mainTextColor;
    ctx.font = `${fontSize}px hvbo`;
    ctx.textAlign = "center";

    ctx.rotate(this.textAngle);
    ctx.fillText(this.data.mainText, 0,0);

  }

  drawLogo(ctx)
  {
    if (!this.data.hasOwnProperty('logoText') ||
        !this.data.hasOwnProperty('logoColor')) {
        return;
    }

    ctx.translate(this.hVal(100), this.vVal(750));

    ctx.fillStyle = this.data.logoColor;
    ctx.strokeStyle = this.data.logoColor;
    ctx.lineWidth = this.hVal(5);

    let fontSize = this.vVal(30);

    ctx.font = `${fontSize}px pretendo`;
    ctx.textAlign = "left";

    ctx.rotate(this.textAngle);
    ctx.fillText(this.data.logoText, this.hVal(10), this.logoHeight/2+this.vVal(10));

    let metrics = ctx.measureText(this.data.logoText);
    this.logoWidth = metrics.width + this.hVal(175);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(metrics.width + this.hVal(20), 0);
    ctx.arc(metrics.width + this.hVal(20), this.logoHeight/2, this.logoHeight/2, Math.PI * 1.5, Math.PI/2);

    ctx.lineTo(metrics.width + this.hVal(20), this.logoHeight);
    ctx.lineTo(0, this.logoHeight);
    ctx.arc(0, this.logoHeight/2, this.logoHeight/2, Math.PI/2, Math.PI * 1.5);

    ctx.stroke();
  }

  drawSecondText(ctx)
  {
    if (!this.data.hasOwnProperty("secondaryTextColor") ||
        !this.data.hasOwnProperty("secondaryText")) return;

    ctx.save();

    let fontSize = this.vVal(30);

    ctx.fillStyle = this.data.secondaryTextColor;
    ctx.translate(this.logoWidth, this.vVal(690));
    ctx.font = `${fontSize}px hvbo`;
    ctx.textAlign = "left";

    ctx.rotate(this.textAngle);
    ctx.fillText(this.data.secondaryText, 0, this.logoHeight/2+this.vVal(10));

    ctx.restore();
  }

  drawSeal(ctx)
  {
    if (!this.data.hasOwnProperty('sealText') ||
      !this.data.hasOwnProperty('sealColor')) return;

    let sealR = this.hVal(110);

    ctx.translate(this.hVal(620), this.vVal(960));

    ctx.strokeStyle = this.data.sealColor;
    ctx.fillStyle = this.data.sealColor;
    ctx.lineWidth = this.hVal(20);

    ctx.beginPath();
    ctx.arc(0, 0, sealR, 0, Math.PI*2);
    ctx.stroke();

    let n = 50;
    for (let i=0; i < n; i++)
    {
      ctx.save();
      ctx.rotate(i * (Math.PI * 2 / n));
      ctx.beginPath();
      ctx.moveTo(sealR-this.hVal(2), -this.vVal(10));
      ctx.lineTo(sealR+this.hVal(30), 0);
      ctx.lineTo(sealR-this.hVal(2), this.vVal(10));
      ctx.fill();
      ctx.restore();
    }

    ctx.font = '24px hvbld';
    ctx.textAlign = "center";

    let parts = this.data.sealText.split("\n");

    ctx.save();
    ctx.translate(0, parts.length*-this.vVal(12)+this.vVal(24));
    parts.forEach(line => {
      ctx.fillText(line, 0, 0);
      ctx.translate(0, this.vVal(24));
    })
    ctx.restore();

  }
}
