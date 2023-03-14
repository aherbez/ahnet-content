function lerp(v1, v2, t)
{
    return ((v1 * (1-t)) + (v2 * t));
}

function smoothstep(t)
{
    return t * t * (3 - 2 * t);
}

function shuffleArray(a)
{
    /*
        var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
    */

    let j,i,x;
    for (i=a.length-1; i > 0; i--)
    {
        j = Math.floor(Math.random() * (i+1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }

    return a;
}


class Noise1d {

    constructor(sampleSize, width)
    {
        this.width = width;
        this.slice = this.width / sampleSize;
        this.samples = [];

        for (let i=0; i < sampleSize; i++)
        {
            this.samples.push(Math.random());
        }
    }

    getValue(x)
    {
        let v = x % this.width;

        let i = (v / this.slice);
        let t = i - Math.floor(i);
        i = Math.floor(i);
        
        let i2 = i + 1;
        if (i2 >= this.samples.length)
        {
            i2 = 0;
        }
        return lerp(this.samples[i], this.samples[i2], smoothstep(t));
    }
}

class Noise2d {

    constructor(sampleSize, size)
    {
        this.size = size;
        this.slice = this.size / sampleSize;
        this.sampleSize = sampleSize;

        this.samples = [];

        for (let i=0; i < this.sampleSize; i++)
        {
            this.samples[i] = Math.random();
        }

        this.permutationTable = [];
        for (let i=0; i < this.sampleSize*2; i++)
        {
            this.permutationTable[i] = i % this.sampleSize;
        }
        shuffleArray(this.permutationTable);
    }

    _getValueAt(x, y)
    {
        if (x < 0 || x >= this.sampleSize) return 0;
        if (y < 0 || y >= this.sampleSize) return 0;

        let index = this.permutationTable[x] + y;

        return this.samples[this.permutationTable[index]];
    }

    getValue(x, y)
    {
        let vx = x % this.size;
        let ix = (vx / this.slice);
        let tx = ix - Math.floor(ix);
        ix = Math.floor(ix);
        let ix2 = (ix < this.sampleSize-1) ? ix+1 : 0;

        let vy = y % this.size;
        let iy = (vy / this.slice);
        let ty = iy - Math.floor(iy);
        iy = Math.floor(iy);
        let iy2 = (iy < this.sampleSize-1) ? iy+1 : 0;

        let nx1 = lerp(this._getValueAt(ix, iy), this._getValueAt(ix2, iy), tx);
        let nx2 = lerp(this._getValueAt(ix, iy2), this._getValueAt(ix2, iy2), tx);

        return lerp(nx1, nx2, ty);
    }

    toImage(ctx, imgSize)
    {
        let imgData = ctx.createImageData(imgSize, imgSize);
        let x, y, v;
        let v1, v2, v3;

        let pixels = [];

        let maxVal = -Infinity;
        let mult = 1;

        let numLevels = 5;

        for (let i=0; i < imgSize*imgSize; i++)
        {
            x = i % imgSize;
            y = Math.floor(i / imgSize);

            x = (x/imgSize) * this.size;
            y = (y/imgSize) * this.size;

            v = 0;
            mult = 1;
            for (let j=0; j < numLevels; j++)
            {
                v += this.getValue(x*mult, y*mult) * (1/mult);
                mult *= 2;
            }

            pixels[i] = v;

            if (v > maxVal) maxVal = v;

        }   

        let index = 0;
        for (let i=0; i < imgData.data.length; i+=4)
        {
            index = Math.floor(i/4);

            v = pixels[index]/maxVal;
            // v = (v > maxVal * 0.75) ? 0 : 1;

            imgData.data[i+0] = v * 255;
            imgData.data[i+1] = v * 255;
            imgData.data[i+2] = v * 255;
            imgData.data[i+3] = 255;            
        }

        return imgData;
    }
}