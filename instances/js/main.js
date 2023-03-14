
let downloadLink, imgInput;
let refImg = null;

// CANVASES

const CANVAS_SIZE = 512;
const OUTPUT_SIZE = 256;
const PREVIEW_SIZE = 200;

let canvas, ctx; 
let offscreenCanvas = null;
let offscreenCtx = null;
let outputCanvas, outputCtx;
const layers = [];
let currLayer = 0;
let previewCanvas, previewCtx;
let loadLayerCanvas, loadLayerCtx;
let tempCanvas, tempCtx;

let backgroundImage = null;

let isDrawing = false;
let lastPoint = null;

let outputSizeSelect;

const NUM_LAYERS = 4;
let outputSize = CANVAS_SIZE;


const MODE_DRAW = 1;
const MODE_ERASE = 2;
let mousePos = {
    x: 0,
    y: 0
}
let currSize = 20;
let mode = MODE_DRAW;

// UI ELEMENTS
let layerSelect = null;

function init() {
    canvas = document.getElementById('stage');
    ctx = canvas.getContext('2d');

    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = OUTPUT_SIZE;
    offscreenCanvas.height = OUTPUT_SIZE;
    offscreenCtx = offscreenCanvas.getContext('2d');

    outputCanvas = document.createElement('canvas');
    outputCanvas.width = OUTPUT_SIZE;
    outputCanvas.height = OUTPUT_SIZE;
    outputCtx = outputCanvas.getContext('2d');

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    
    document.querySelector('#input-img').addEventListener('change', handleFile);
    document.querySelector('#input-file-layers').addEventListener('change', handleLayerFile);

    layerSelect = document.querySelector('#layer-list');
    layerSelect.addEventListener('change', changeLayer);

    for (let i=0; i < NUM_LAYERS; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.restore();

        layers.push({
            canvas: canvas,
            ctx: ctx
        });
    }

    loadLayerCanvas = document.createElement('canvas');
    loadLayerCtx = loadLayerCanvas.getContext('2d');
    tempCanvas = document.createElement('canvas');
    tempCtx = tempCanvas.getContext('2d');

    previewCanvas = document.querySelector('#output-canvas');
    previewCtx = previewCanvas.getContext('2d');

    btnDraw = document.querySelector('#btn-draw');
    btnDraw.addEventListener('click', () => {
        mode = MODE_DRAW;
        btnDraw.disabled = true;
        btnErase.disabled = false;
    });
    
    btnErase = document.querySelector('#btn-erase');
    btnErase.addEventListener('click', () => {
        mode = MODE_ERASE;
        btnErase.disabled = true;
        btnDraw.disabled = false;
    });


    document.querySelector('#btn-smaller').addEventListener('click', () => {
        changeBrushSize(-5);        
    });
    document.querySelector('#btn-bigger').addEventListener('click', () => {
        changeBrushSize(5);
    });

    document.querySelector('#brush-size').value = currSize;
    /*
    document.querySelector('#grid-num').addEventListener('change', (evt) => {
        if (!updateGridNum(evt.target.value)) {
            document.querySelector('#grid-num').value = gridNum;
        }
    });
    */
    /*
    outputSizeSelect = document.querySelector('#output-size');
    outputSizeSelect.addEventListener('change', (evt) => {
        if (!updateOutputSize(evt.target.value)) {
            outputSizeSelect.value = outputSize;
        }
    })
    */
    downloadLink = document.createElement('a');

    render();
}

function changeBrushSize(amt) {
    currSize += amt;
    if (currSize < 5) currSize = 5;

    document.querySelector('#brush-size').value = currSize;

}

function changeLayer() {
    const currIndex = parseInt(layerSelect.value);
    if (!isNaN(currIndex)) {
        currLayer = currIndex;
    }
}

function handleFile(evt) {
    let imgFile = evt.target.files[0];
    if (imgFile) {
        if (!refImg) {
            refImg = new Image();
        }

        let reader = new FileReader();
        reader.onload = function(event) {
            console.log('reader onload');
            refImg.onload = () => {
                backgroundImage = refImg;
            }
            refImg.src = event.target.result;
        }
        reader.readAsDataURL(imgFile);
    }
}

function handleLayerFile(evt) {
    let imgFile = evt.target.files[0];
    if (imgFile) {
        let layerImg = new Image();

        let reader = new FileReader();
        reader.onload = function(event) {
            layerImg.onload = (evt) => {
                console.log(layerImg.width, layerImg.height);

                loadLayerCanvas.width = OUTPUT_SIZE;
                loadLayerCanvas.height = OUTPUT_SIZE;

                loadLayerCtx.clearRect(0, 0, layerImg.width, layerImg.height);
                loadLayerCtx.drawImage(layerImg, 0, 0);

                // let imgData = offscreenCtx.getImageData(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
                let imgData = loadLayerCtx.getImageData(0, 0, layerImg.width, layerImg.height);
                console.log(imgData);

                tempCanvas.width = OUTPUT_SIZE;
                tempCanvas.height = OUTPUT_SIZE;

                const pixelsPerLayer = (OUTPUT_SIZE / NUM_LAYERS) * OUTPUT_SIZE;

                // load each layer
                for (let i=0; i < NUM_LAYERS; i++) {

                    for (let l=0; l < NUM_LAYERS; l++) {
                        tempCtx.save();
                        tempCtx.fillStyle = '#FFF';
                        tempCtx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
                        tempCtx.fillStyle = 'rgba(0, 0, 0, 1)';
    
                        for (let j=0; j < pixelsPerLayer; j++) {
                            let index = (OUTPUT_SIZE * OUTPUT_SIZE) - (pixelsPerLayer * l);
                            index = (index-j) * 4;
                            let r = imgData.data[index];
                            let g = imgData.data[index+1];
                            let b = imgData.data[index+2];

                            if (b > 128) {
                                let x = Math.floor((r / 255) * OUTPUT_SIZE) + 1;
                                let y = Math.floor((g / 255) * OUTPUT_SIZE) + 1;
                                tempCtx.fillRect(x, y, 1, 1);
                            }
                        }
                        
                        layers[l].ctx.save();
                        layers[l].ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
                        layers[l].ctx.scale(CANVAS_SIZE/OUTPUT_SIZE, CANVAS_SIZE/OUTPUT_SIZE);
                        layers[l].ctx.globalCompositeOperation = 'source-over';
                        layers[l].ctx.drawImage(tempCanvas, 0, 0);
                        layers[l].ctx.restore();

                        tempCtx.restore();

                    }

                }


            }
            layerImg.src = event.target.result;
        }
        reader.readAsDataURL(imgFile);
    }
}


function updateOutputSize(newVal) {
    const intVal = parseInt(newVal);
    if (isNaN(intVal) || (intVal < gridNum) || (intVal === outputSize)) {
        return false;
    }
    outputSize = intVal;
    outputCanvas.width = outputSize;
    outputCanvas.height = outputSize;
    return true;
}

function maybeDrawReferenceImg() {
    if (backgroundImage !== null) {
        ctx.save();

        const sx = backgroundImage.width / CANVAS_SIZE;
        const sy = backgroundImage.height / CANVAS_SIZE;

        ctx.scale(sx, sy);
        ctx.drawImage(backgroundImage, 0, 0);

        ctx.restore();
    }
}

function render() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.save();
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.restore();

    // draw ref image, if one exists
    maybeDrawReferenceImg(ctx);

    // draw current layer
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(layers[currLayer].canvas, 0, 0);
    ctx.restore();

    // draw output
    previewCtx.save();
    
    previewCtx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    let s = PREVIEW_SIZE / OUTPUT_SIZE;
    previewCtx.scale(s, s);
    previewCtx.drawImage(outputCanvas, 0, 0);

    previewCtx.restore();
    updateOutput();


    ctx.save();
    ctx.translate(mousePos.x, mousePos.y);
    ctx.strokeStyle = 'rgb(128,128,128)';
    ctx.beginPath();
    ctx.arc(0, 0, currSize, 0, Math.PI * 2);
    ctx.stroke();


    ctx.restore();


    requestAnimationFrame(render);
}


function writeLayerToOutput(i) {
    if (i < 0 || i >= NUM_LAYERS) return;
    
    const s = OUTPUT_SIZE / CANVAS_SIZE;
    offscreenCtx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    offscreenCtx.save();
    offscreenCtx.scale(s, s);
    offscreenCtx.fillStyle = '#FFF';
    offscreenCtx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    offscreenCtx.drawImage(layers[i].canvas, 0, 0);

    offscreenCtx.restore();

    let imgData = offscreenCtx.getImageData(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    let pixelsDrawn = 0;
    let yOffset = (OUTPUT_SIZE / NUM_LAYERS) * i;
    let maxPixelsPerLayer = (OUTPUT_SIZE / NUM_LAYERS) * OUTPUT_SIZE;

    outputCtx.save();
    for (let y=0; y < OUTPUT_SIZE; y++) {
        for (let x=0; x < OUTPUT_SIZE; x++) {
            const pixelIndex = ((y * OUTPUT_SIZE) + x) * 4;

            let r = imgData.data[pixelIndex];
            let g = imgData.data[pixelIndex+1];
            let b = imgData.data[pixelIndex+2];
            let a = imgData.data[pixelIndex+3];

            // did we find a pixel?
            if (r < 128 && pixelsDrawn < maxPixelsPerLayer) {
                // position to color
                let newR = Math.floor((x / OUTPUT_SIZE) * 255);
                let newG = Math.floor((y / OUTPUT_SIZE) * 255);
                let fillColor = rgbToHex(newR, newG, 255);
                
                let xPos = pixelsDrawn % OUTPUT_SIZE;
                let yPos = (OUTPUT_SIZE - 1) - Math.floor(pixelsDrawn / OUTPUT_SIZE);
                outputCtx.fillStyle = fillColor;
                outputCtx.fillRect(xPos, yPos - (yOffset), 1, 1);
                pixelsDrawn++;
            }
        } 
    }
    outputCtx.restore();
}

function updateOutput() {
    outputCtx.save();
    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    outputCtx.fillStyle = '#000';
    outputCtx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    outputCtx.restore();

    for (let i=0; i < NUM_LAYERS; i++) {
        writeLayerToOutput(i);
    }
}

function saveImg() {

    let fileName = document.querySelector('#file-name').value;
    fileName = fileName.split('.')[0];
    if (!fileName || fileName === '') {
        fileName = 'swatches';
    }
    fileName += '.png';

    downloadLink.download = fileName;

    downloadLink.href = outputCanvas.toDataURL()
    downloadLink.click();

}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hexColor) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ];
}

function evtToPos(evt) {
    return {
        x: evt.clientX - 10,
        y: evt.clientY - 10
    }
}

function currCtx() {
    return layers[currLayer].ctx;
}

function addDot(p) {
    
    let c = currCtx();

    c.fillStyle = (mode === MODE_DRAW) ? '#000' : '#FFF';
    
    c.beginPath();
    c.arc(p.x, p.y, currSize, 0, Math.PI*2);
    c.fill();
    
    // ctx.fillRect(p.x - (size/2), p.y - (size/2), size, size);
}

function onMouseDown(evt) {
    isDrawing = true;

    /*
    const gridPix = CANVAS_SIZE / gridNum;
    const x = Math.floor((evt.clientX - 10) / gridPix);
    const y = Math.floor((evt.clientY - 10) / gridPix);

    selectedSwatch[0] = x;
    selectedSwatch[1] = y;
    */
    const p = evtToPos(evt);
    addDot(p);
    lastPoint = p; 

}

function onMouseMove(evt) {
    let p = evtToPos(evt);

    mousePos = p;

    if (isDrawing) {
        currCtx().save();


        addDot(p);

        currCtx().restore();
    }
}

function onMouseUp(evt) {
    isDrawing = false;
}


init();