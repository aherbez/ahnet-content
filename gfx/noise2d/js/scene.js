let mainScene = null;

class Scene 
{
    constructor(el)
    {
        this.canvas = document.getElementById(el);
        this.gl = this.canvas.getContext("webgl");

        if (this.gl === null)
        {
            alert('WebGL not available.');
        }
        
        const vsSource = `
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

        const fsSource = `
            varying highp vec2 vTextureCoord;
            highp vec2 newTex;
            
            uniform sampler2D uSampler;
            uniform mediump float u_time;
            void main() {
                newTex = vec2(vTextureCoord);
                newTex.x += sin(u_time)* 0.25 + 0.25;
                newTex.y += cos(u_time)*0.25 + 0.25;
                gl_FragColor = texture2D(uSampler, vTextureCoord);
            }
        `;

        const shaderProgram = this.initShaderProgram(this.gl, vsSource, fsSource);

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                uSampler: this.gl.getUniformLocation(shaderProgram, 'uSampler')
            }
        };


        this.texture = this.loadTexture(this.gl, 'img/colored_blocks.png');

        // this.buffers = this.initBuffers(this.gl);
        
        this.rotation = Math.PI/4;

        this.chunk = new Chunk(this.gl, 32, 1.0);

        this.update();

        mainScene = this;
    }

    update()
    {
        this.rotation += 0.01;

        this.drawScene(this.gl, this.programInfo, this.buffers);
        requestAnimationFrame(this.update.bind(this));
    }

    loadTexture(gl, url)
    {
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
        image.src = url;

        return texture;
    }

    isPowerOf2(value)
    {
        return (value & (value - 1) == 0);
    }
    

    drawScene(gl, programInfo, buffers)
    {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programInfo.program);

        const fieldOfView = 45 * Math.PI / 180; // 45 deg in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 1000.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix,
            modelViewMatrix,
                [-0.0, -10.0, -100.0]);
        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            Math.PI/8,
            [1,0,0]);
        
        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [0,1,0]);
        
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );
    

        gl.bindBuffer(gl.ARRAY_BUFFER, this.chunk.positionBuffer);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.chunk.textureCoordBuffer);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.chunk.indexBuffer);
        
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexCount = this.chunk.vertexCount;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
        
    }

    
    initShaderProgram(gl, vsSource, fsSource)
    {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        return shaderProgram;
    }
    
    loadShader(gl, type, source)
    {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    } 
     
}