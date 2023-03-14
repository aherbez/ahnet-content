class UIel
{
  constructor(){}

  applyStyles(domNode, styleList)
  {
    for (const key in styleList)
    {
      domNode.style[key] = styleList[key];
    }
  }
}

class LoadImageButton extends UIel
{
  constructor(el)
  {
    super();

    this.base = document.getElementById(el);

    this.fileBtnActual = document.createElement("input");
    this.fileBtnActual.type = "file";

    this.applyStyles(this.fileBtnActual, {
      position: 'absolute',
      left: '-1000px',
      top: -10,
      display: 'hidden'
    });

    this.loadBtn = document.createElement("button");
    this.loadBtn.innerHTML = "Load Image";
    this.loadBtn.onclick = function() {
      this.fileBtnActual.click();
    }.bind(this);
    this.fileBtnActual.onchange = this._setImage.bind(this);

    this.applyStyles(this.loadBtn, {
      height: '30px',
      borderRadius: '5px',
      margin: '10px',
      marginLeft: '0px',
      padding: '5px',
    });

    this.base.appendChild(this.loadBtn);
    this.base.appendChild(this.fileBtnActual);

    this.imageLoadedCallback = null;
  }

  _setImage(evt)
  {
    let file = evt.target.files[0] || null;

    if (file) {
        console.log(file);

        if (this.imageLoadedCallback !== null) {
          console.log('CALLBACK');
          this.imageLoadedCallback(file);
        }
    }
  }
}

class cbColorInput extends UIel
{
  constructor(parent, options)
  {
    super();
    this.parent = parent;

    this.base = document.createElement("div");
    this.applyStyles(this.base, {
      padding: '5px',
      margin: '5px',
      border: '1px solid #000',
      fontFamily: 'arial, sans'
    });

    this._label = document.createElement("span");
    this._label.innerHTML = options.label || "label: ";
    this.applyStyles(this._label, {
      position: 'relative',
      width: '200px',
      paddingRight: '20px',
      display: 'inline-block'
    });

    this.colorPicker = document.createElement("input");
    this.colorPicker.type = "color";
    this.colorPicker.onchange = function()
    {
      this._setValue();
    }.bind(this);

    let startValue = options.default || "#000000";
    this.value = startValue;

    this.base.appendChild(this._label);
    this.base.appendChild(this.colorPicker);

    this.colorSetCallback = null;
  }

  set value(newValue)
  {
    this.colorPicker.value = newValue;
  }

  get value()
  {
    return this.colorPicker.value;
  }

  _setValue()
  {
    console.log('setting value ', this.value);
    if (this.colorSetCallback != null)
    {
      this.colorSetCallback(this.value);
    }
  }
}

class cbTextInput extends UIel
{
  constructor(parent, options)
  {
    super();
    this.parent = parent;

    this.base = document.createElement("div");
    this.applyStyles(this.base, {
      padding: '5px',
      margin: '5px',
      border: '1px solid #000',
      fontFamily: 'arial, sans'
    });

    this._label = document.createElement("span");
    this._label.innerHTML = options.label || "label: ";
    this.applyStyles(this._label, {
      position: 'relative',
      width: '40px',
      paddingRight: '20px',
      display: 'inline-block'
    });

    this._inputTxt = document.createElement("input");
    this._inputTxt.type = "text";
    this._inputTxt.onchange = function() {
      this._setValue();
    }.bind(this);
    this._inputTxt.onenter = function() {
      this._setValue();
    }.bind(this);
    this.applyStyles(this._inputTxt, {
      width: '200px',
    });

    this.value = options.default || "";

    this._btn = document.createElement("button");
    this._btn.innerHTML = "set";
    this._btn.onclick = function() {
      this._setValue();
    }.bind(this);
    this.applyStyles(this._btn, {
      width: '30px',
    });


    this.base.appendChild(this._label);
    this.base.appendChild(this._inputTxt);
    this.base.appendChild(this._btn);

    this.parent.appendChild(this.base);

    this.valueSetCallback = null;
  }

  set label(txt)
  {
    this._label.innerHTML = txt;
  }

  set value(newVal)
  {
    this._inputTxt.value = newVal;
  }

  get value()
  {
    return this._inputTxt.value;
  }

  _setValue()
  {
    console.log('setting value ', this.value);
    if (this.valueSetCallback != null)
    {
      this.valueSetCallback(this._inputTxt.value);
    }
  }
}


class ImageGeneratorInputGroup extends UIel
{
  constructor(imgGen, parentEl)
  {
    super();
    this.base = document.getElementById(parentEl);

    this.generator = imgGen;
    this.inputs = [];
  }

  addTextOption(displayName, varName, defaultVal)
  {
    let txtInput = new cbTextInput(this.base, {
      label: displayName,
      default: defaultVal
    });
    txtInput.valueSetCallback = function() {
      console.log('value set callback: ', txtInput.value);

      let newData = {};
      newData[varName] = txtInput.value;
      this.generator.data = newData;
    }.bind(this);

    this.inputs.push(txtInput.base);
    this.base.appendChild(txtInput.base);
  }

  addColorOption(displayName, varName, defaultVal)
  {
    let colorInput = new cbColorInput(this.base, {
      label: 'Author Text Color',
      default: defaultVal
    });
    colorInput.colorSetCallback = function() {
      let newData = {};
      newData[varName] = colorInput.value;
      this.generator.data = newData;
    }.bind(this);

    this.inputs.push(colorInput.base);
    this.base.appendChild(colorInput.base);
  }
}

class CubocoImgGen
{
  constructor(outputEl, options)
  {
    console.log("new ImgGenCB");
    this.outputImg = document.getElementById(outputEl);

    this.imgWidth = options.width || 480;
    this.imgHeight = options.height || 640;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.imgWidth;
    this.canvas.height = this.imgHeight;

    document.body.appendChild(this.canvas);

    let cstyle = {
      position: 'absolute',
      left: '-1000px',
      top: '0px'
    };

    for (let prop in cstyle) {
      this.canvas.style[prop] = cstyle[prop];
    }

    this.ctx = this.canvas.getContext("2d");

    this._data = {};
    this._images = {};
    this._imagesLoaded = {};

    this._dirty = true;
    this._maybeUpdate();
  }

  setImage(name, file)
  {
    if (!this._images.hasOwnProperty(name))
    {
      this._images[name] = new Image();
    }

    this._imagesLoaded[name] = false;

    let self = this;
    let reader = new FileReader();
    reader.onload = function(event)
    {
      self._images[name].onload = function() {
        self._imagesLoaded[name] = true;
        self._render();
      }
      self._images[name].src = event.target.result;

    }
    reader.readAsDataURL(file);
  }

  getImage(name)
  {
    if (this._imagesLoaded.hasOwnProperty(name) && this._imagesLoaded[name] === true)
    {
      if (this._images.hasOwnProperty(name)) {
        return this._images[name];
      }
    }

    return null;
  }

  addFont(font)
  {
    let self = this;
    let fontText = `10px ${font}`;
    document.fonts.load(fontText).then(function (fontFace) {
      self._dirty = true;
    });
  }

  set data(newData)
  {

    for (let prop in newData)
    {
      if (this._data.hasOwnProperty(prop))
      {
        if (this._data[prop] !== newData[prop]) {
          // console.log("new value for: " + prop);
          this._dirty = true;
        }
      }
      else {
        // console.log("new property: " + prop);
        this._dirty = true;
      }

      this._data[prop] = newData[prop];
    }
    console.log(this._data);
  }

  get data()
  {
    return this._data;
  }

  _maybeUpdate()
  {
    if (this._dirty === true)
    {
      this._render();
      this._dirty = false;
    }
    requestAnimationFrame(this._maybeUpdate.bind(this));
  }

  drawWaterMark(ctx, msg)
  {
    ctx.save();

    ctx.fillStyle = 'rgba(0,0,0,0.2)';

    let txtSize = Math.floor(this.imgHeight/10);
    ctx.font = `${txtSize}px sans-serif`;

    let metrics = ctx.measureText(msg);
    let reps = Math.floor(this.imgWidth / metrics.width) * 2;
    if (metrics.width >= this.imgWidth) reps = 2;

    let msgText = [];
    for (let i=0; i < reps; i++) { msgText.push(msg)}
    msgText = msgText.join(" ");

    let repsY = Math.floor(this.imgHeight / (txtSize * 1.2)) + 1;

    for (let i=0; i < repsY; i++)
    {
      ctx.fillText(msgText, 0, txtSize + ((txtSize * 1.2) * i));
    }

    ctx.restore();
  }

  render(ctx)
  {
    // this._debugDrawX(ctx);
    this.drawWaterMark(ctx, "CUBOCO.COM");
  }

  _render()
  {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.imgWidth, this.imgHeight);

    this.render(this.ctx);

    this.ctx.restore();
    this._outputToImg();
  }

  _outputToImg()
  {
    this.outputImg.src = this.canvas.toDataURL("image/png");
  }
}
