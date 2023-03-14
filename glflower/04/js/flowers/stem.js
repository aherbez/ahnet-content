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
                gl_FragColor = vec4(1.-vTextureCoord[1], vTextureCoord[1], 0., 1.0);

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
        
        let centerVec = vec3.fromValues(offset[0],
            offset[1],
            0);

        let verts = [];
        let normals = [];
        let n;
        this.baseRingPos.forEach( v => {            
            vFinal = vec3.fromValues(
                v[0] * rad,
                0,
                v[2] * rad
            );
            
            vec3.rotateZ(vFinal, vFinal, origin, rotation);
            
            n = vec3.create();

            vec3.sub(n, vFinal, centerVec);
            vec3.normalize(n, n);

            normals.push(n[0], n[1], n[2]);

            verts.push( [vFinal[0] + offset[0],
                vFinal[1] + offset[1], 
                vFinal[2]]);
            
        });
        verts = verts.reduce((acc, val) => acc.concat(val), []);
        this.vertexPositions = this.vertexPositions.concat(verts);

        this.normals = this.normals.concat(normals);

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

    _addLeaf(u, leafSeed)
    {
        let r = this.rand;

        let leaf;
        let p1, p2;
        let angle;
        let rad;        

        p1 = this.baseCurve.getPointAt(u);
        p2 = this.baseCurve.getPointAt(u + 0.2);

        rad = ((this.r2 - this.r1) * u) + this.r1;

        angle = p1.angleTo(p2);

        leaf = new Leaf(this.gl, leafSeed);

        angle = r.random() * 360;
        leaf.rotationY = -angle;
        leaf.rotationX = r.random() * -60;
        
        angle = this.degToRad(angle);

        leaf.z = 0 - Math.sin(angle) * rad;
        leaf.y = p1.y;
        leaf.x = p1.x - (Math.cos(angle) * rad);

        this.addChild(leaf);

    }

    _addLeaves()
    {
        let r = this.rand;

        let numLeaves = r.randInt(5, 20);
        
        let leafSeed = r.randInRange(1, 1000);

        /*
        let leaf;
        let p1, p2;
        let angle;
        let rad;        
        */
        let u;
        for (let i=0; i < numLeaves; i++)
        {
            u = r.randInRange(0.1, 0.79);
            this._addLeaf(u, leafSeed);
            /*
            p1 = this.baseCurve.getPointAt(
                (i / numLeaves)
            );
            p2 = this.baseCurve.getPointAt(
                (i+1)/numLeaves
            );

            rad = (this.r2 - this.r1) * (i/numLeaves) + this.r1;

            angle = p1.angleTo(p2);

            leaf = new Leaf(this.gl, leafSeed);

            angle = r.random() * 360;
            // leaf.rotationY = -angle;
            leaf.rotationX = r.random() * -60;
            
            angle = this.degToRad(angle);

            leaf.z = 0 - Math.sin(angle) * rad;
            leaf.y = p1.y;
            leaf.x = p1.x - (Math.cos(angle) * rad);

            this.addChild(leaf);
            */
        }
    }

    updateGeometry()
    {
        let r = this.rand;

        this.height = r.randInRange(20, 60);
        this.depth = r.randInRange(0, 10);

        // height = 20;
        // depth = 30;

        this.midpoint = r.random() * (this.height/4) + (this.height * 0.25);

        // create base curve
        this.baseCurve = new bzCurveQuad(
            new Point(0, 0),
            new Point(0, this.midpoint),
            new Point(this.depth, this.height)
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

        this.r1 = 1;
        this.r2 = 0.2;

        this._addVertRing(0, 0, this.r1, [0,0], 0);
        
        let rad, u, y;
        let pt;
        let angle;
        let ptPrev = new Point(0, 0);

        for (let i=1; i < divsHeight; i++)
        {
            u = (i / (divsHeight-1));
            rad = (this.r2 - this.r1) * u + this.r1;

            pt = this.baseCurve.getPointAt(u);
            angle = pt.angleTo(ptPrev);
            angle = -(Math.PI/2 - angle);

            this._addVertRing(0, u, rad, [pt.x, pt.y], angle);
            this._addRingFaces(i-1, i, divsRound);    
        
            ptPrev = pt;
        }


        this._addLeaves();

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