class Chunk {

    constructor(gl, numBlocks, blockSize)
    {
        console.log('new chunk: ' + numBlocks);
        
        this.gl = gl;

        this.numBlocks = numBlocks;
        this.blockSize = blockSize;
        this.halfVoxelSize = this.blockSize/2;

        this.data = [];

        let startTime = Date.now();
        
        for (let y=0; y<numBlocks; y++)
        {
            this.data[y] = [];
            for (let z=0; z < numBlocks; z++)
            {
                this.data[y][z] = [];
                for (let x=0; x < numBlocks; x++)
                {
                    this.data[y][z][x] = 0;
                }
            }
        }
        this.addGround();

        let elapsedTime = Date.now() - startTime;
        console.log('INIT VOXEL DATA TIME: ' + (elapsedTime/1000));

        this.FRONT = 0;
        this.BACK = 1;
        this.TOP = 2;
        this.BOTTOM = 3;
        this.RIGHT = 4;
        this.LEFT = 5;

        this.vertexPositions = [];
        this.textureCoords = [];
        this.faceIndices = [];
        this.vertexCount = 0;
        this.numQuads = 0;

        this.initBuffers(this.gl);

        this.refreshGeometry(this.gl);
    }

    addGround()
    {

        for (let y=0; y<this.numBlocks; y++)
        {
            for (let z=0; z < this.numBlocks; z++)
            {
                for (let x=0; x < this.numBlocks; x++)
                {
                    if (y < 1)
                    {
                        this.data[y][z][x] = 1;
                    }
                }
            }
        }

        this.addBaseBuildings();
    }

    addBaseBuildings()
    {
        // let y = 1;

        for (let y=1; y < 11; y++) 
        {
            for (let z=0; z < this.numBlocks; z++)
            {
                for (let x=0; x< this.numBlocks; x++)
                {
                    if (x > 0 && z > 0 && x < this.numBlocks-1 && z < this.numBlocks-1)
                    {
                        this.data[y][z][x] = 3;
                    }
                }
            }
        }
    }

    _getFaceVerts(side, position)
    {
        const cubePositions = [
            // Front Face
            [-1.0, -1.0, 1.0,
             1.0, -1.0, 1.0,
             1.0,  1.0, 1.0,
            -1.0,  1.0, 1.0],

            // Back face
            [-1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0],

             // Top face
            [-1.0,  1.0, -1.0,
             -1.0,  1.0,  1.0,
              1.0,  1.0,  1.0,
              1.0,  1.0, -1.0],

            // Bottom face
            [-1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0],

            // Right face
            [1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0],

             // Left face
            [-1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0]
        ];

        return cubePositions[side];
    }

    timeFunction(name, f)
    {
        let startTime = Date.now();
        f();
        let elapsedTime = Date.now() - startTime;
        console.log(name + ' ' + (elapsedTime));
    }

    _getTextCoord(side, voxelType)
    {
        let x1 = ((voxelType-1) % 4) * 0.25;
        let y1 = (Math.floor((voxelType-1)/4)) * 0.5;

        let x2 = x1 + 0.25;
        let y2 = y1 + 0.5;

        return [
            x1, y1,
            x2, y1,
            x2, y2,
            x1, y2
        ];        
    }

    _addQuad(direction, position, size, voxelType)
    {
        let rawVerts = this._getFaceVerts(direction).slice();

        let offset = [-(this.blockSize * (this.numBlocks/2)), 0, -(this.blockSize * (this.numBlocks/2))];

        rawVerts = rawVerts.map((value, index) => {
            return (value * this.halfVoxelSize) + 
                (position[index%3] * this.blockSize) + 
                offset[index%3];
        });

        let nextVertIndex = this.numQuads * 4;
        this.vertexPositions = this.vertexPositions.concat(rawVerts);

        this.textureCoords = this.textureCoords.concat(this._getTextCoord(direction, voxelType));

        this.faceIndices = this.faceIndices.concat([
            nextVertIndex, nextVertIndex+1, nextVertIndex+2,
            nextVertIndex, nextVertIndex+2, nextVertIndex+3
        ]);
        this.numQuads++;
    }

    _addVoxel(position, voxelType)
    {
        let x,y,z;
        [x,y,z] = position;

        // front: +1 Z
        if (((z+1) >= this.numBlocks) || (this.data[y][z+1][x] == 0))
        {
            this._addQuad(this.FRONT, position, this.blockSize, voxelType);
        }

        // back: -1 Z
        if (((z-1) < 0) || (this.data[y][z-1][x] == 0))
        {
            this._addQuad(this.BACK, position, this.blockSize, voxelType);
        }

        // left: -1 X
        if (((x-1) < 0) || (this.data[y][z][x-1] == 0))
        {
            this._addQuad(this.LEFT, position, this.blockSize, voxelType);
        }

        // right: +1 X
        if (((x+1) >= this.numBlocks) || (this.data[y][z][x+1] == 0))
        {
            this._addQuad(this.RIGHT, position, this.blockSize, voxelType);
        }

        // top: +1 Y
        if (((y+1) >= this.numBlocks) || (this.data[y+1][z][x] == 0))
        {
            this._addQuad(this.TOP, position, this.blockSize, voxelType);
        }

        // bottom: -1 Y
        if (((y-1) < 0) || (this.data[y-1][z][x] == 0))
        {
            this._addQuad(this.BOTTOM, position, this.blockSize, voxelType);
        }
    }

    _addVoxelAtIndex(i)
    {
        let x,y,z = 0;

        /*
        123
        hundreds = n / 100
        tens = (n % 100) / 10
        one = tens % 10
        */


        let start = i;
        z = start / (this.numBlocks * this.numBlocks);
        y = (i % (this.numBlocks * this.numBlocks)) / 10;
        x = 
        /*
        x = i % this.numBlocks;
        y = i % (this.numBlocks * this.numBlocks);
        z = Math.floor(this.numBlocks * this.numBlocks);
        */

        this._addVoxel([x,y,z]);
    }

    refreshGeometry(gl)
    {
        this.vertexPositions = [];
        this.textureCoords = [];
        this.faceIndices = [];
        this.vertexCount = 0;
        
        let startTime = Date.now();

        for (let y=0; y<this.numBlocks; y++)
        {
            for (let z=0; z < this.numBlocks; z++)
            {
                for (let x=0; x < this.numBlocks; x++)
                {
                    if (this.data[y][z][x] > 0)
                    {
                        this._addVoxel([x,y,z], this.data[y][z][x]);
                    }
                }
            }
        }
       let elapsedTime = Date.now() - startTime;
       console.log("GEOMETRY INIT TIME: " + (elapsedTime));

        this.vertexCount = this.faceIndices.length;

        this.timeFunction('refresh buffers: ', function() {
            this.refreshBuffers(gl);
        }.bind(this));
        
        console.log(`drawing ${this.numQuads} quads`);
    }

    initBuffers(gl)
    {
        this.positionBuffer = gl.createBuffer();
        this.textureCoordBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
    }

    refreshBuffers(gl)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexPositions), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faceIndices), gl.STATIC_DRAW);
    }



};