class Stem extends DynamicModel
{
    constructor(gl, seed)
    {
        super(gl, seed);

        this.baseRingPos = [];
    }

    initShaders()
    {
        super.initShaders();

        this.fsShaderSource = `
            varying highp vec2 vTextureCoord;
            highp vec2 newTex;

            uniform sampler2D uSampler;
            uniform mediump float u_time;

            void main() {
                // gl_FragColor = vec4(0.2, vTextureCoord[0]-0.5, (1.0-vTextureCoord[0]) * 0.2, 1.0);
                gl_FragColor = vec4(vTextureCoord[0], 1.0, vTextureCoord[1], 1.0);
                // gl_FragColor = vec4(0.0, vTextureCoord[1] * 0.4, 0.0, 1.0);
            }        
        `;
    }

    animate(dt)
    {
        // this.rotateY(dt * 0.1);
    }

    _addVertRing(yPos, vCoord, rad, offset, rotation)
    {
        let vFinal;
        let origin = vec3.create();
        // console.log(offset);
        let verts = this.baseRingPos.map( v => {
            
            vFinal = vec3.fromValues(
                v[0] * rad,
                0,
                v[2] * rad
            );
            
            vec3.rotateZ(vFinal, vFinal, origin, rotation);
            
            return [vFinal[0] + offset[0],
                vFinal[1] + offset[1], 
                vFinal[2]];
            
        });
        verts = verts.reduce((acc, val) => acc.concat(val), []);

        this.vertexPositions = this.vertexPositions.concat(verts);

        let texCoords = [];
        for (let i=0; i < this.baseRingPos.length; i++)
        {
            texCoords = texCoords.concat([
                (i / this.baseRingPos.length-1), vCoord
            ]);            
        }
        this.textureCoords = this.textureCoords.concat(texCoords);
    }

    _addRingFaces(rMin, rMax, divs)
    {
        let x1, x2;
        for (let i=0; i < divs; i++)
        {
            x1 = i;
            x2 = (i + 1) % divs;
            this.faceIndices = this.faceIndices.concat(
            [
                rMin * divs + i, rMax * divs + i, rMax * divs + x2, 
                rMin * divs + i, rMax * divs + x2, rMin * divs + x2]        
            );            

        }
    }

    updateGeometry()
    {
        let r = this.rand;

        let height = r.randInRange(20, 60);
        let depth = r.randInRange(0, 5);

        // height = 20;
        // depth = 30;

        let midpoint = r.random() * (height/4) + (height * 0.25);

        // create base curve
        this.baseCurve = new bzCurveQuad(
            new Point(0, 0),
            new Point(0, midpoint),
            new Point(depth, height)
        );

        let divsHeight = 10;
        let divsRound = 32;

        this.baseRingPos = [];

        let x, z, theta;
        let slice = Math.PI * 2 / divsRound;

        for (let i=0; i < divsRound; i++)
        {
            x = Math.cos(i * slice);
            z = Math.sin(i * slice);
            this.baseRingPos.push([x, 0, z]);
        }

        let r1 = 1;
        let r2 = 0.2;

        this._addVertRing(0, 0, r1, [0,0], 0);
        
        let rad, u, y;
        let pt;
        let angle;
        let ptPrev = new Point(0, 0);

        for (let i=1; i < divsHeight; i++)
        {
            u = (i / (divsHeight-1));
            rad = (r2 - r1) * u + r1;

            pt = this.baseCurve.getPointAt(u);
            angle = pt.angleTo(ptPrev);
            angle = -(Math.PI/2 - angle);

            this._addVertRing(0, u, rad, [pt.x, pt.y], angle);
            this._addRingFaces(i-1, i, divsRound);    
        
            ptPrev = pt;
        }

        // this.rotationX = 20;
        /*
        let verts = [
            -10, -10, 0,
            -10, 10, 0,
            10, 10, 0,
            10, -10, 0,
            0, 20, 0
        ];

        this.vertexPositions = this.vertexPositions.concat(verts);
    
        this.textureCoords = this.textureCoords.concat([
            0, 0,
            0, 1,
            1, 1,
            1, 0,
            0.5, 0.5,
        ]);

        this.faceIndices = this.faceIndices.concat([
            0, 2, 1,
            0, 3, 2,
            1, 2, 4
        ]);
        */

        // this.vertexCount = this.faceIndices.length;
    }
}