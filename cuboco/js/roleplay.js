class RoleplayUI extends CubocoImageGeneratorUI
{
  init()
  {
    this.addFileButton('Load Main Image', 'main');

    this.addTextAreaOption('Module description', 'descText', '');

    this.addColorOption('Main Color', 'mainColor', '#e19443');
    this.addColorOption('Banner Color', 'bannerColor', '#ffe500');
    this.addColorOption('Text Color 1', 'txtColor1', '#FFFFFF');
    this.addColorOption('Text Color 2', 'txtColor2', '#fcdf1f');
    this.addColorOption('Text Color 3', 'txtColor3', '#000000');

    this.addTextOptionGroup('Banner Text', 'bannerTxt', 3, ['one', 'two', 'three']);
    this.addTextOption('Corner Text', 'cornerTxt', 'X3');

    this.addTextOption('Top Text', 'topText', 'Dungeon Module X2');
    this.addTextOptionGroup('Title Text', 'moduleTitle', 2, ['Foo', 'Bar']);

    this.addTextOption('Author', 'authorText', 'by blah');
    this.addTextOption('Subtitle', 'subtitleText', 'AN ADVENTURE FOR CHARACTERS LEVELS 3-6');
  }
}

class RoleplayBook extends CubocoImgGen
{
  init()
  {
    this.baseWidth = 1000;
    this.baseHeight = 1200;

    this.ui = new RoleplayUI(this);

    this.mainImgW = this.hVal(900);
    this.mainImgH = this.vVal(620);

    this.data = {
      mainColor: '#e19443',
      txtColor1: '#FFFFFF',
      txtColor2: '#fcdf1f',
      txtColor3: '#000000',
      bannerTxt: ['FOR','ROLEPLAYING ADVENTURE', 'EXPERT SET'],
      cornerTxt: 'X2',
      topText: 'Dungeon Module X2',
      moduleTitle: ['Castle Amber',"(Chateau d' Amberville)"],
      authorText: 'by Tom Moldvay',
      subtitleText: 'AN ADVENTURE FOR CHARACTERS LEVELS 3-6',
      descText: "apophenia j-pop jeans silent footage Kowloon San Francisco chrome Legba neon. rifle smart- nodal point meta- network cardboard pre- modem shoes pistol. ablative gang girl realism cartel network 3D-printed systemic uplink nodality. Tokyo girl sign futurity jeans human drone courier A.I. neon. wristwatch grenade range-rover shrine concrete pen bicycle dome towards j-pop. into spook -ware tower rain shrine free-market construct denim boy. semiotics corrupted table into tower table boy corrupted nodality industrial grade. realism beef noodles construct savant assault rifle disposable vinyl realism 8-bit. A.I. lights network market warehouse dead media sub-orbital engine decay. sub-orbital garage fluidity faded crypto- cardboard courier alcohol math- claymore mine."
    };

    this.addFont("sourceserif-black");
    this.addFont("sourceserif-bold");
    this.addFont("sourceserif-light");
    this.addFont("sourceserif-reg");
    this.addFont("sourceserif-med");

    this.renderActions = [
      this.drawBackground,
      this.drawImage,
      this.drawCornerText,
      this.drawCornerBanner,
      this.drawCornerBannerText,
      this.drawTopText,
      this.drawDescription
    ];

  }

  drawBackground(ctx)
  {
    ctx.fillStyle = this.data.mainColor;
    ctx.fillRect(0, 0, this.imgWidth, this.imgHeight);
  }

  drawImage(ctx)
  {
    ctx.translate((this.imgWidth-this.mainImgW)/2, this.vVal(320));

    let img = this.getImage('main');
    if (img !== null)
    {

      if (false)
      {
        ctx.drawImage(img, 0, 0);
      }
      else
      {
        let sourceDimensions = this.croppedImageDimensions(img, this.mainImgW, this.mainImgH);

        // console.log(sourceDimensions);
        let x = Math.floor((img.width-sourceDimensions[0])/2);
        let y = Math.floor((img.height-sourceDimensions[1])/2);

        ctx.drawImage(img,
            x, y,
            sourceDimensions[0], sourceDimensions[1],
            0, 0,
            this.mainImgW, this.mainImgH);
      }
    }
    else {
      ctx.fillStyle = "rgb(128, 128, 128)";

      ctx.strokeStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, this.mainImgW, this.mainImgH);
      ctx.strokeRect(0, 0, this.mainImgW, this.mainImgH);
    }

  }

  drawCornerText(ctx)
  {
    let fontSize = this.vVal(36);

    if (this.data.hasOwnProperty('cornerTxt')) {
      ctx.fillStyle = this.data.txtColor2;

      ctx.font = `${fontSize}px sourceserif-black`;
      ctx.textAlign = "center";
      ctx.translate(this.hVal(70), this.vVal(80));
      ctx.fillText(this.data.cornerTxt, 0, 0);
    }
  }

  drawTopText(ctx)
  {
    let fontSize = this.vVal(40);
    let fontSizeSmaller = this.vVal(30);

    ctx.font = `${fontSize}px sourceserif-black`;
    ctx.textAlign = "center";

    ctx.fillStyle = this.data.txtColor1;

    ctx.save();
    ctx.translate(this.imgWidth/2, this.vVal(120));
    ctx.fillText(this.data.topText, 0, 0);
    ctx.restore();

    if (this.data.hasOwnProperty('moduleTitle')) {
      ctx.save();
      ctx.fillStyle = this.data.txtColor2;
      ctx.translate(this.imgWidth/2, this.vVal(165));

      this.data.moduleTitle.forEach(line => {
        ctx.fillText(line, 0, 0);
        ctx.translate(0, fontSize);
      });
      ctx.restore();
    }

    ctx.save();
    ctx.font = `${fontSizeSmaller}px sourceserif-black`;
    ctx.fillStyle = this.data.txtColor1;

    ctx.translate(this.imgWidth/2, this.vVal(245));
    ctx.fillText(this.data.authorText, 0, 0);

    ctx.restore();

    ctx.save();
    ctx.font = `${fontSizeSmaller}px sourceserif-reg`;
    ctx.fillStyle = this.data.txtColor1;

    ctx.translate(this.imgWidth/2, this.vVal(295));
    ctx.fillText(this.data.subtitleText, 0, 0);

    ctx.restore();
  }

  drawDescription(ctx)
  {
    let fontSize = this.vVal(20);
    let fontSpacing = this.vVal(5);
    let lineHeight = fontSize + fontSpacing;

    if (this.data.hasOwnProperty('descText'))
    {
      let parts = this.data.descText.split("\n");

      ctx.font = `${fontSize}px sourceserif-med`;
      ctx.fillStyle = this.data.txtColor1;
      ctx.translate(this.hVal(40), this.vVal(980));

      parts.forEach(line => {
        let lines = this.drawWrappedText(line, this.hVal(900), lineHeight);
        ctx.translate(0, lines * lineHeight);
      });
    }
  }

  drawCornerBanner(ctx)
  {
    ctx.fillStyle = this.data.bannerColor || "#ffe500";
    ctx.beginPath();
    ctx.moveTo(this.hVal(170), 0);
    ctx.lineTo(this.hVal(330), 0);
    ctx.lineTo(0, this.vVal(340));
    ctx.lineTo(0, this.vVal(180));
    ctx.fill();
  }

  drawCornerBannerText(ctx)
  {
    let fontSize = this.vVal(25);
    let fontSpacing = this.vVal(5);

    ctx.translate(this.hVal(120), this.vVal(140) - (fontSize + fontSpacing));
    ctx.rotate(Math.PI * -0.26  );

    ctx.font = `${fontSize}px sourceserif-bold`;
    ctx.textAlign = "center";
    ctx.fillStyle = this.data.txtColor3 || "#000";

    if (this.data.hasOwnProperty('bannerTxt'))
    {
      this.data.bannerTxt.forEach(line => {
          ctx.fillText(line, 0, 0);
          ctx.translate(0, (fontSize + fontSpacing));
      });
    }
  }

}
