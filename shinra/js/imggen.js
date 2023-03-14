class UIel
{
  constructor(parent)
  {
    this.parent = parent;
    this.base = document.createElement("div");
    this.varName = null;
  }

  applyStyles(domNode, styleList)
  {
    for (const key in styleList)
    {
      domNode.style[key] = styleList[key];
    }
  }

  makeTopLevel()
  {
    this.applyStyles(this.base, {
      padding: '5px',
      margin: '5px',
      border: '1px solid #000',
      fontFamily: 'arial, sans'
    });
  }

  maybeSetValue(name, value)
  {
    if (this.varName === name)
    {
      this.value = value;
    }
  }
}

class LoadImageButton extends UIel
{
  constructor(parent, options)
  {
    super(parent);
    this.fileBtnActual = document.createElement("input");
    this.fileBtnActual.type = "file";

    this.applyStyles(this.fileBtnActual, {
      position: 'absolute',
      left: '-1000px',
      top: -10,
      display: 'hidden'
    });

    this.loadBtn = document.createElement("button");
    this.loadBtn.innerHTML = options.btnText || "Load Image";
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

    this.parent.appendChild(this.base);

    this.imageLoadedCallback = null;
  }

  _setImage(evt)
  {
    let file = evt.target.files[0] || null;

    if (file) {
        if (this.imageLoadedCallback !== null) {
          this.imageLoadedCallback(file);
        }
    }
  }
}

class cbColorInput extends UIel
{
  constructor(parent, options)
  {
    super(parent);

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
    super(parent);

    this._label = document.createElement("span");
    this._label.innerHTML = options.label || "";
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
    if (this.valueSetCallback != null)
    {
      this.valueSetCallback(this._inputTxt.value);
    }
  }

  get value()
  {
    return this._inputTxt.value;
  }

  _setValue()
  {
    if (this.valueSetCallback != null)
    {
      this.valueSetCallback(this._inputTxt.value);
    }
  }
}

class cbTextInputGroup extends UIel
{
  constructor(parent, options)
  {
    super(parent, options);
    this.numLines = options.numLines || 1;
    this.displayName = options.label || "";
    this.inputs = [];

    this.label = document.createElement("div");
    this.label.innerHTML = this.displayName;

    this.base.appendChild(this.label);

    for (let i=0; i < this.numLines; i++)
    {
      let txtIn = new cbTextInput(this.base, `line ${i+1}`);
      txtIn.valueSetCallback = function() {
        this.valueChange(i, txtIn.value);
      }.bind(this);
      this.inputs.push(txtIn);
    }

    this.parent.appendChild(this.base);
  }

  getValues()
  {
    let values = [];
    this.inputs.forEach(input => {
      values.push(input.value);
    });
    return values;
  }

  valueChange(i, newValue)
  {
    if (this.valueChangeCallback !== null)
    {
      this.valueChangeCallback(i, newValue);
    }
  }

  set value(newValues)
  {
    console.log(newValues, this);
    newValues.forEach((val, i) => {
      this.inputs[i].value = val;
    })
  }

}

class cbTextAreaInput extends UIel
{
  constructor(parent, options)
  {
    super(parent, options);

    this.label = document.createElement("span");
    this.label.innerHTML = options.label || "text:";
    this.applyStyles(this.label, {
      verticalAlign: "top",
      padding: "5px"
    });

    this.entry = document.createElement("textarea");
    this.entry.rows = options.rows || 5;
    this.entry.cols = options.columns || 23;
    this.entry.placeholder = options.defaultText || "Enter text here...";
    this.entry.onchange = this._onChange.bind(this);


    this.base.appendChild(this.label);
    this.base.appendChild(this.entry);

    this.valueChangeCallback = null;
  }

  get value()
  {
    return this.entry.value;
  }

  set value(newValue)
  {
    this.entry.value = newValue;
  }

  _onChange()
  {
    if (this.valueChangeCallback !== null)
    {
      this.valueChangeCallback();
    }
  }
}

class CubocoImageGeneratorUI extends UIel
{
  constructor(imgGen)
  {
    super();
    this.generator = imgGen;

    this.base = document.getElementById(this.generator.controlsEl);

    this.inputs = [];

    this.inputLookup = {};

    this.init();
  }

  init() {};

  addFileButton(displayName, varName)
  {
    let imgBtn = new LoadImageButton(this.base, {
      btnText: displayName
    });
    imgBtn.imageLoadedCallback = function(file) {
      this.generator.setImage(varName, file);
    }.bind(this);

    this.inputs.push(imgBtn.base);

    this.inputLookup[varName] = imgBtn;

    this.base.appendChild(imgBtn.base);
    imgBtn.makeTopLevel();
  }

  addTextOption(displayName, varName, defaultVal)
  {
    let txtInput = new cbTextInput(this.base, {
      label: displayName,
      default: defaultVal
    });
    txtInput.valueSetCallback = function() {
      let newData = {};
      newData[varName] = txtInput.value;
      this.generator.data = newData;
    }.bind(this);

    this.inputs.push(txtInput.base);
    this.inputLookup[varName] = txtInput;
    this.base.appendChild(txtInput.base);
    txtInput.makeTopLevel();
  }

  addTextOptionGroup(displayName, varName, numLines, defaultVals)
  {
    let optionGrp = new cbTextInputGroup(this.base, {
      label: displayName,
      numLines: numLines,
    });
    optionGrp.valueChangeCallback = function(i, newValue) {

      let newData = {};
      newData[varName] = optionGrp.getValues();
      this.generator.data = newData;

    }.bind(this);

    this.inputs.push(optionGrp.base);
    this.inputLookup[varName] = optionGrp;
    this.base.appendChild(optionGrp.base);
    optionGrp.makeTopLevel();
  }

  addTextAreaOption(displayName, varName)
  {
    let txtArea = new cbTextAreaInput(this.base, {
      label: displayName
    });
    txtArea.valueChangeCallback = function() {
      let newData = {};
      newData[varName] = txtArea.value;
      this.generator.data = newData;
    }.bind(this);

    this.inputs.push(txtArea.base);
    this.inputLookup[varName] = txtArea;
    this.base.appendChild(txtArea.base);
    txtArea.makeTopLevel();
  }

  addColorOption(displayName, varName, defaultVal)
  {
    let colorInput = new cbColorInput(this.base, {
      label: displayName,
      default: defaultVal
    });
    colorInput.colorSetCallback = function() {
      let newData = {};
      newData[varName] = colorInput.value;
      this.generator.data = newData;
    }.bind(this);

    this.inputs.push(colorInput.base);
    this.inputLookup[varName] = colorInput;
    this.base.appendChild(colorInput.base);
    colorInput.makeTopLevel();
  }

  setInitialValues(data)
  {
    for (const key in data)
    {
      let value = data[key];
      if (this.inputLookup[key])
      {
        this.inputLookup[key].value = value;
      }
    }
  }
}

class CubocoImgGen
{
  constructor(outputEl, controlsEl, options)
  {
    this.outputImg = document.getElementById(outputEl);
    this.outputImg.crossOrigin = "anonymous";

    this.controlsEl = controlsEl;

    this.ui = null;

    this.imgWidth = options.width || 480;
    this.imgHeight = options.height || 640;

    this.baseWidth = 900;
    this.baseHeight = 1200;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.imgWidth;
    this.canvas.height = this.imgHeight;

    document.body.appendChild(this.canvas);

    let cstyle = {
      display: 'none'
    };
    for (let prop in cstyle) {
      this.canvas.style[prop] = cstyle[prop];
    }

    this.ctx = this.canvas.getContext("2d");

    this._data = {};
    this._images = {};
    this._imagesLoaded = {};
    this.renderActions = [];

    this.init();

    if (this.ui !== null)
    {
      this.ui.setInitialValues(this.data);
    }

    this._dirty = true;
    this._maybeUpdate();
  }

  // override
  init() {}

  hVal(inVal)
  {
    return Math.round((inVal / this.baseWidth) * this.imgWidth);
  }

  vVal(inVal)
  {
    return Math.round((inVal / this.baseHeight) * this.imgHeight);
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

  wrapText(text, maxWidth)
  {
    let ctx = this.ctx;

    let lines = [];
    let inputLines = text.trim().split("\n");

    let currentLine = "";
    let testLine;
    let metrics;

    inputLines.forEach((inLine, i) => {

      currentLine = "";

      let words = inLine.trim().split(" ");
      words = words.map(w => {
        return w.trim();
      });
      words = words.filter(w => {
        return (w !== "");
      });


      words.forEach(word => {
        testLine = currentLine + " " + word;
        metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth)
        {
          // ctx.fillText(currentLine, 0, yPos);
          // yPos += lineHeight;
          lines.push(currentLine);
          currentLine = word;
        }
        else
        {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);

      if (i !== inputLines.length-1)
      {
        lines.push("");
      }

    });

    return lines;
  }


  drawWrappedText(text, maxWidth, lineHeight)
  {
    let ctx = this.ctx;

    let parts = text.split(" ");

    let currentLine = "";
    let testLine;
    let metrics;
    let yPos = 0;
    let linesDrawn = 0;

    parts.forEach(word => {
        testLine = currentLine + " " + word;
        metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth)
        {
          ctx.fillText(currentLine, 0, yPos);
          yPos += lineHeight;
          currentLine = word;
          linesDrawn++;
        }
        else
        {
          currentLine = testLine;
        }
    });
    ctx.fillText(currentLine, 0, yPos);
    linesDrawn++;

    return linesDrawn;
  }

  getImageScale(img, targetWidth, targetHeight)
  {
    let scaleW = targetWidth / img.width;
    let scaleH = targetHeight / img.height;
    return Math.max(scaleW, scaleH);
  }

  croppedImageDimensions(img, targetWidth, targetHeight)
  {
    let aspect = targetWidth / targetHeight;
    let scaleW = targetWidth / img.width;
    let scaleH = targetHeight / img.height;

    let newDims = [];

    if (scaleW > scaleH)
    {
      // extra vertical image
      newDims[0] = img.width;
      newDims[1] = Math.floor(img.width / aspect);
    }
    else
    {
      // extra horizontal
      newDims[0] = Math.floor(aspect * img.height);
      newDims[1] = img.height;
    }
    return newDims;
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
          this._dirty = true;
        }
      }
      else {
        this._dirty = true;
      }
      this._dirty = true;
      this._data[prop] = newData[prop];
    }
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

  performRenderActions(functionList)
  {
    functionList.forEach(f => {
      this.ctx.save();
      f.call(this, this.ctx);
      this.ctx.restore();
    });
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
    // this.drawWaterMark(ctx, "CUBOCO.COM");
  }

  _render()
  {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.imgWidth, this.imgHeight);

    this.performRenderActions(this.renderActions);

    this.render(this.ctx);

    this.ctx.restore();
    this._outputToImg();
  }

  _renderLoading()
  {
    this.ctx.save();

    this.ctx.beginPath();
    this.ctx.fillStyle = "rgb(128, 128, 128)";
    this.ctx.fillRect(0, 0, this.imgWidth, this.imgHeight);
    this.ctx.fillRect(0, 0, 400, 400);

    this.ctx.restore();

    this._outputToImg();
  }

  _outputToImg()
  {
    this.outputImg.src = this.canvas.toDataURL("image/png");
  }
}
