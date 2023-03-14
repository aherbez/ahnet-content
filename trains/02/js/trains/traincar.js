class TrainCar extends DynamicModel
{
    constructor(gl, seed, options)
    {
        super(gl, seed);
    }

    initShaders()
    {
        super.initShaders();
        
        this.fsShaderSource = `
            varying highp vec2 vTextureCoord;
            varying highp vec3 vLighting;
            varying highp vec3 vNormal;

            uniform sampler2D uSampler;

            uniform mediump vec3 petalColor;
            uniform mediump vec3 petalCenterColor;

            void main() {

                mediump vec3 color = vec3(vTextureCoord[0]);

                mediump float mixVal = ((vTextureCoord[0]/0.5) + vTextureCoord[1]) / 2.;

                mixVal = distance(vTextureCoord, vec2(0.5, 0.));

                color = mix(petalCenterColor, petalColor, mixVal);
                
                if (gl_FrontFacing) {
                    color *= vec3(vTextureCoord[0] * 0.45);
                }

                // gl_FragColor = vec4(color * vLighting, 1.);
                
                gl_FragColor = vec4(vTextureCoord[0], vTextureCoord[1], 0., 1.0);
                // gl_FragColor = vec4(vNormal, 1.0);
            }
        `;         
    }    

    setDimensions()
    {
        let r = this.rand;
        this.width = r.randInRange(20, 25); //   20;
        this.height = r.randInRange(20, 30); // 20;
        this.depth = r.randInRange(50, 70); // 50;

        this.windowBot = 2;
        this.windowHeight = 2;

        this.hallwayWidthMult = r.randInRange(0.1, 0.3);
        this.numCabins = r.randInt(2, 7);

        this.cornerDepth = r.randInRange(5,10);
        
        this.width = 30;
        this.height = 20;
        this.depth = 50;        
        this.cornerDepth = 5;
    }

    animate(dt)
    {
        // this.rotateX(dt * 0.1);
        this.rotateY(dt * 0.1);
        // this.rotateZ(dt * 0.1);
        
        // this.rotationY = 90;
        this.rotationZ = 45;
        // this.rotationY = 90;
    }

    _addVerts()
    {
        let verts = [
            -this.width/2, 0, -this.depth/2,
             this.width/2, 0, -this.depth/2,
             this.width/2, 0,  this.depth/2,
            -this.width/2, 0,  this.depth/2,

            -this.width/2, this.height, -this.depth/2,
             this.width/2, this.height, -this.depth/2,
             this.width/2, this.height,  this.depth/2,
            -this.width/2, this.height,  this.depth/2,            
        ];

        let uvs = [
            0, 0, 
            0, 0,
            0, 0,
            0, 0,

            0, 0, 
            0, 0,
            0, 0,
            0, 0
        ];

        for (let i=0; i < 8; i++)
        {

            this.addVertex(verts[i*3], verts[i*3+1], verts[i*3+2],
                uvs[i*2], uvs[i*2+1]);
        }

        // this.vertexPositions = this.vertexPositions.concat(verts);
    }

    _addFaces()
    {
        let indices = [
            0, 4, 5,    // back
            0, 5, 1,

            2, 6, 7,    // front
            2, 7, 3,
        ];

        this.faceIndices = this.faceIndices.concat(indices);
    }

    _setBaseShape()
    {
        
        // curve for front and back (half)
        this.frontCurve = new bzCurveCubic(
            new Point(0, 0),
            new Point(0, 0.25),
            new Point(0.25, 1),
            new Point(1, 1),
        ); 
        console.log(this.frontCurve);
        
        let divs = 12;
        let capPoints = [];

        let u;
        let p;
        for (let i=0; i < divs; i++)
        {
            u = i / (divs-1);
            p = this.frontCurve.getPointAt(u);
            capPoints.push(vec2.fromValues(
                p.x / 2,
                p.y
            ));
        }
        
        for (let i=1; i < divs; i++)
        {
            u = 1 - (i / (divs-1));
            p = this.frontCurve.getPointAt(u);
            capPoints.push(vec2.fromValues(
                ((1-p.x) / 2) + 0.5,
                p.y
            ));
        }
        
        
        this.floor = new Polygon();

        // add curve along back
        capPoints.forEach(p => {
            this.floor.addPoint(vec2.fromValues( 
                p[0] * (this.width) - (this.width/2),
                p[1] * -this.cornerDepth - (this.depth/2)    
            ));
        });
        capPoints.reverse();
        
        // add curve along front
        capPoints.forEach(p => {
            this.floor.addPoint(vec2.fromValues( 
                p[0] * (this.width) - (this.width/2),
                p[1] * this.cornerDepth + (this.depth/2)    
            ));
        });

        /*
        let divs = 12;
        let rad = 5;
        let theta = Math.PI * 2 / divs;
        this.floor = new Polygon();
        // this.floor.addPoint(vec3.fromValues())
        for (let i=0; i < divs; i++)
        {
            this.floor.addPoint(vec2.fromValues(
                Math.cos(theta * i) * rad,
                Math.sin(theta * i) * rad
            ));
        };
        */
    }

    _addWalls()
    {
        let w = this.floor.makeShell(1);
        this.walls = new ExtrudedGeometry(this.gl, this.floor);
        this.walls.extrudeShell(this.height*1.2, 1, 7);
        // this.addChild(this.walls);

        let floor2 = this.floor.copy();
        let cutLine = new Line2d(vec2.fromValues(-(this.width*-0.2), -this.depth*2),
            vec2.fromValues(-(this.width*-0.2), 0));
        

        // let cutIndex = floor2.addPointAtIntersection(cutLine);
        
        let door = 2;
        let window = 3;

        cutLine = new Line2d(vec2.fromValues(0, -this.depth*2), vec2.fromValues(0, 0));
        floor2.addFeatureAtIntersection(cutLine, 15, door);

        cutLine = new Line2d(vec2.fromValues(0, this.depth*2), vec2.fromValues(0, 0));
        floor2.addFeatureAtIntersection(cutLine, 5, window);


        // cutLine = new Line2d(vec2.fromValues(0, 0), vec2.fromValues(500, 500));
        // floor2.addFeatureAtIntersection(cutLine, 15, window);

        let edges = floor2.getEdges();
        edges.forEach(e => {

            switch (e.data)
            {
                case door:
                {
                    let newWall = new ExtrudedGeometry(this.gl);
                    newWall.extrudeEdge(e, 1, this.height * 0.2, 0.8, 1);
                    newWall.y = this.height * 0.8;
                    this.addChild(newWall);
                }
                break;
                case window:
                {
                    let wn1 = new ExtrudedGeometry(this.gl);
                    let wn2 = new ExtrudedGeometry(this.gl);

                    wn1.extrudeEdge(e, 1, this.height * 0.4, 0, 0.4);
                    wn2.extrudeEdge(e, 1, this.height * 0.2, 0.8, 1);
                    wn2.y = this.height * 0.8;
                    this.addChild(wn1);
                    this.addChild(wn2);

                }
                    break;
                default:
                {
                    let newWall = new ExtrudedGeometry(this.gl);
                    newWall.extrudeEdge(e, 1, this.height, 0, 1);
                    this.addChild(newWall);
                }
        
            }

        });
        
        // console.log(edges);

        /*
        let test = new ExtrudedGeometry(this.gl, floor2);
        test.extrude(5, 7);
        this.addChild(test);
        */

        // let f = new ExtrudedGeometry(this.gl, this.floor);
        let f = this.floor.copy();
        f.shrink(0.1);
        this.floorGeo = new ExtrudedGeometry(this.gl, f);
        this.floorGeo.extrude(1, 7);
        this.floorGeo.y = -0.10;
        this.floorGeo.x = 0;
        this.floorGeo.z = 0;
        // this.addChild(this.floorGeo);


        // CABINS
        return;
        let splitLine = new Line2d(vec2.fromValues(this.width * this.hallwayWidthMult, -this.depth), 
                vec2.fromValues(this.width * this.hallwayWidthMult, this.depth));
        let parts = this.floor.cut(splitLine);

        let cabinBase = parts[0];
        cabinBase.shrink(0.2);


        let cabins = [];
        let cabin;
        let numCabins = 4;
        let cabinDepth = this.depth / this.numCabins;
        // numCabins = 2;
        for (let i=1; i < this.numCabins; i++)
        {
            vec2.set(splitLine.start, this.width * -10, (i * cabinDepth) - this.depth/2);
            vec2.set(splitLine.end, this.width * 10, (i * cabinDepth) - this.depth/2);

            parts = cabinBase.cut(splitLine);

            cabin = new ExtrudedGeometry(this.gl, parts[1]);
            cabin.extrudeShell(this.height, 1, 7);
            cabins.push(cabin);
            this.addChild(cabin);

            cabinBase = parts[0];            
        }
        cabin = new ExtrudedGeometry(this.gl, cabinBase);
        cabin.extrudeShell(this.height, 1, 7);
        cabins.push(cabin);
        this.addChild(cabin);

        /*
        let left = new ExtrudedGeometry(this.gl, parts[0]);
        left.extrudeShell(this.height, 1, 7);
        this.addChild(left);

        let right = new ExtrudedGeometry(this.gl, parts[1]);
        right.extrudeShell(this.height, 1, 7);
        // this.addChild(right);
        */
    }

    _extrude(p, h)
    {
        // add the vertices twice
        let verts = [];
        let normals = [];
        let uvs = [];

        verts[0] = vec3.fromValues(p.center[0], 0, p.center[1]);
        uvs[0] = [0.5, 0.5];
        normals[0] = vec3.fromValues(0, -1, 0);

        verts[p.numPoints + 1] = vec3.fromValues(p.center[0], h, p.center[1]);
        uvs[p.numPoints + 1] = [0.5, 0.5];
        normals[p.numPoints + 1] = vec3.fromValues(0, 1, 0);

        let n;
        let u;
        p.points.forEach((pt,i) => {
            n = p.normals[i];
            u = (i / (p.numPoints-1));
            verts[1 + i] = vec3.fromValues(pt[0], 0, pt[1]);
            uvs[1 + i] = [u, 0];
            normals[1 + i] = vec3.fromValues(n[0], 0, n[1]);
            
            verts[p.numPoints + i + 2] = vec3.fromValues(pt[0], h, pt[1]);
            uvs[p.numPoints + i + 2] = [u, 1];
            normals[p.numPoints + i + 2] = vec3.fromValues(n[0], 0, n[1]);

        });

        for (let i=0; i < verts.length; i++)
        {
            this.addVertex(verts[i][0], verts[i][1], verts[i][2],
                uvs[i][0], uvs[i][1],
                [normals[i][0], normals[i][1], normals[i][2]]);
        }

        let extrudeMode = 4;

        let indices = [];

        let topcapCent = p.numPoints + 1;        
        let i1, i2, i3, i4;

        for (let i=0; i < p.numPoints; i++)
        {
            i1 = i + 1;
            i2 = (i + 1) % p.numPoints + 1;
            i3 = i1 + topcapCent;
            i4 = i2 + topcapCent;

            // bottom cap
            if (extrudeMode & 1)
            {
                indices.push(
                    0, i1, i2
                );
            }

            // top cap
            if (extrudeMode & 2)
            {
                indices.push(
                    topcapCent, i4, i3
                );    
            }
            
            // exterior
            if (extrudeMode & 4)
            {
                indices.push(
                    i1, i3, i4,
                    i1, i4, i2
                );
    
            }
        }

        this.faceIndices = this.faceIndices.concat(indices);
    }


    updateGeometry()
    {
        this.setDimensions();

        this._setBaseShape();
        this._addWalls();
    }
}