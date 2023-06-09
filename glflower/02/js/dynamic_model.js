class DynamicModel
{
    constructor(gl, seedVal)
    {
        this.gl = gl;

        this.pos = vec3.create();
        
        this.data = [];
    
        this.vertexPositions = [];
        this.textureCoords = [];
        this.faceIndices = [];
        this.vertexCount = 0;
        this.triangleCount = 0;
        this.numQuads = 0;

        this.modelViewMatrix = mat4.create();
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1]; 

        this.rand = new LGCRandom();

        if (!isNaN(seedVal))
        {
            this.rand.seed = seedVal;
        }

        this.textures = [];

        this.initBuffers(this.gl);

        this._updateGeometryWrapper(this.gl);
        
        this._setupShaders();

        this.parent = null;
        this.children = [];
    }

    addChild(c)
    {
        c.parent = this;
        this.children.push(c);
    }

    removeChild(node)
    {
        node.parent = null;
        this.children = this.children.filter(child => {
            return (child !== node);
        });
    }

    radToDeg(r) { return (r * 180 / Math.PI); }
    degToRad(d) { return (d * (Math.PI / 180)); }

    // syntactic sugar for transform data
    set x(v) { this.position[0] = v; }
    set y(v) { this.position[1] = v; }
    set z(v) { this.position[2] = v; }

    set rotationX(v){ this.rotation[0] = this.degToRad(v); }
    set rotationY(v) { this.rotation[1] = this.degToRad(v); }
    set rotationZ(v) { this.rotation[2] = this.degToRad(v); }

    set scaleX(v) { this.scale[0] = v; }
    set scaleY(v) { this.scale[1] = v; }
    set scaleZ(v) { this.scale[2] = v; }

    translateX(v) { this.position[0] += v; }
    translateY(v) { this.position[1] += v; }
    translateZ(v) { this.position[2] += v; }

    rotateX(v){ this.rotation[0] += this.degToRad(v); }
    rotateY(v){ this.rotation[1] += this.degToRad(v); }
    rotateZ(v){ this.rotation[2] += this.degToRad(v); }

    set projectionMatrix(mat)
    {
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            mat
        );
    }

    set texture(texSrc)
    {
        let gl = this.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType, pixel);
        
        const image = new Image();
        image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                srcFormat, srcType, image);
            if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        }.bind(this);
        image.src = texSrc;

        this.textures.push(texture);
    }

    isPowerOf2(val)
    {
        return (val & (val - 1) === 0);
    }

    _setupShaders()
    {
        this.initShaders();

        this.compileShaders();

        this.setProgramInfo();
    }

    initShaders()
    {
        this.vShaderSource = `
            attribute vec4 aVertexPosition;
            attribute vec2 aTextureCoord;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;

            varying highp vec2 vTextureCoord;

            void main() {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                vTextureCoord = aTextureCoord;
            }
        `;

        this.fsShaderSource = `
            varying highp vec2 vTextureCoord;
            highp vec2 newTex;

            uniform sampler2D uSampler;

            void main() {
                // newTex = vec2(vTextureCoord);
                // gl_FragColor = vec4(0.2, vTextureCoord[0]-0.5, (1.0-vTextureCoord[0]) * 0.2, 1.0);
                gl_FragColor = vec4(1.0);
            }
        `;
    }

    setProgramInfo()
    {
        this.programInfo = {
            program: this.shaderProgram,
            attribLocations: {},
            uniformLocations: {}
        };

        this.setAttribLocation('vertexPosition', 'aVertexPosition');
        this.setAttribLocation('textureCoord', 'aTextureCoord');
        this.setUniformLocation('projectionMatrix', 'uProjectionMatrix');
        this.setUniformLocation('modelViewMatrix', 'uModelViewMatrix');
        this.setUniformLocation('uSampler');
    }

    setAttribLocation(name, shaderVar)
    {
        let nameInShader = shaderVar || name;
        this.programInfo.attribLocations[name] = this.gl.getAttribLocation(this.shaderProgram, nameInShader);
    }

    setUniformLocation(name, shaderVar)
    {
        let nameInShader = shaderVar || name;
        this.programInfo.uniformLocations[name] = this.gl.getUniformLocation(this.shaderProgram, nameInShader);
    }

    get vShaderSource()
    {
        return this._vShaderSrc;
    }

    set vShaderSource(src)
    {
        this._vShaderSrc = src;
    }

    get fsShaderSource()
    {
        return this._fsShaderSource;
    }

    set fsShaderSource(src)
    {
        this._fsShaderSource = src;
    }

    compileShaders()
    {
        let gl = this.gl;
        this.vertexShader = this._loadShader(gl.VERTEX_SHADER, this.vShaderSource);
        this.fragmentShader = this._loadShader(gl.FRAGMENT_SHADER, this.fsShaderSource);

        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, this.vertexShader);
        gl.attachShader(this.shaderProgram, this.fragmentShader);
        gl.linkProgram(this.shaderProgram); 
    }

    _loadShader(type, src)
    {
        let gl = this.gl;
        const shader = gl.createShader(type);
        
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    set seedVal(newSeed)
    {
        this.rand.seed = newSeed;
        this._updateGeometryWrapper(this.gl);
    }

    initBuffers(gl)
    {
        this.positionBuffer = gl.createBuffer();
        this.textureCoordBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
    }

    update(dt)
    {
        this.animate(dt);
        this.children.forEach(c => {
            c.update(dt);
        });
    }

    // override
    animate(dt) {}

    _updateGeometryWrapper(gl)
    {
        this.rand.init();

        this.vertexPositions = [];
        this.textureCoords = [];
        this.faceIndices = [];

        this.updateGeometry();
    }

    addVertex(x, y, z, u, v)
    {
        this.vertexPositions.push(x, y, z);
        this.textureCoords.push(u, v);
    }

    updateGeometry(gl)
    {
        // actual geometry setup goes here

        let scale = 5;
        let rawVerts = [
            -1.0, -1.0, 1.0,
             1.0, -1.0, 1.0,
             1.0,  1.0, 1.0,
            -1.0,  1.0, 1.0
        ];

        rawVerts = rawVerts.map(v => {
            return v * scale;
        });

        this.vertexPositions = this.vertexPositions.concat(rawVerts);

        this.textureCoords = [
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ];

        this.faceIndices = [
            0, 1, 2,
            0, 2, 3
        ];

        this.triangleCount = 2;
    }

    _setBuffers()
    {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexPositions), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faceIndices), gl.STATIC_DRAW);
    }

    draw(proj, modelview)
    {
        this._setBuffers();

        let gl = this.gl;

        gl.useProgram(this.programInfo.program);
        
        this.projectionMatrix = proj;
        
        this.modelViewMatrix = (modelview) ? mat4.clone(modelview) : mat4.create();

        mat4.scale(this.modelViewMatrix,
            this.modelViewMatrix,
            this.scale);
        mat4.translate(this.modelViewMatrix,
            this.modelViewMatrix,
            this.position);

        this.rotation.forEach((r, i) => {
            mat4.rotate(this.modelViewMatrix,
                this.modelViewMatrix,
                this.rotation[i], 
                [
                    (i == 0 ? 1 : 0),
                    (i == 1 ? 1 : 0),
                    (i == 2 ? 1 : 0)
                ]);
        });

        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexPosition,
            3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(
            this.programInfo.attribLocations.vertexPosition
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.vertexAttribPointer(
            this.programInfo.attribLocations.textureCoord,
            2, gl.FLOAT, false, 0, 0
        );
        gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
        
        if (this.textures.length > 0)
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
        }
        gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);
        
        gl.drawElements(gl.TRIANGLES, this.faceIndices.length, gl.UNSIGNED_SHORT, 0);

        this.children.forEach(c => {
            c.draw(proj, this.modelViewMatrix);
        })
    }
}