
class DynWire {
    constructor() {
        this.verts = [];
        this.origin = new THREE.Vector3();
        this.baseScale = new THREE.Vector3(1, 1, 1);
        this.rotation = 0;

        this.extentsMin = new THREE.Vector3(Infinity, Infinity, Infinity);
        this.extentsMax = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    }

    add(x, y, z) {
        this.verts.push(new THREE.Vector3(x, y, z));
    
        this.extentsMin.set(
            Math.min(this.extentsMin.x, x),
            Math.min(this.extentsMin.y, y),
            Math.min(this.extentsMin.z, z),
        );

        this.extentsMax.set(
            Math.max(this.extentsMax.x, x),
            Math.max(this.extentsMax.y, y),
            Math.max(this.extentsMax.z, z),
        );
    }

    append(wire) {
        wire.verts.forEach(v => {
            this.add(v.x, v.y, v.z);
        })
    }

    copy() {
        let dw = new DynWire();
        this.forEach(v => {
            dw.verts.push(v.clone());
        })
        return dw;
    }

    applyTransforms() {
        let dw = this.copy();
        dw.rotateEach(this.rotation);
        dw.translateEach(this.origin.x, this.origin.y, this.origin.z);
        dw.scaleEach(this.baseScale.x, this.baseScale.y, this.baseScale.z);
        return dw;
    }

    setScale(x, y, z) {
        this.baseScale.set(x, y, z);
    }

    setTranslate(x, y, z) {
        this.origin.set(x, y, z);
    }

    scale(x, y, z) {
        this.baseScale.set(
            this.baseScale.x * x,
            this.baseScale.y * y,
            this.baseScale.z * z,
        );
    }

    scaleEach(x, y, z) {
        let scaleVect = new THREE.Vector3(x, y, z);
        this.verts.forEach( (v,i) => {            
            this.verts[i].multiply(scaleVect);
        });
    }

    translate(x, y, z) {
        const offset = new THREE.Vector3(x, y, z);
        this.origin.add(offset);
        // this.origin.set(x, y, z);
    }

    translateEach(x, y, z) {
        let moveVect = new THREE.Vector3(x, y, z);
        this.verts.forEach( (v,i) => {
            this.verts[i].add(moveVect);
        });
    }

    rotate(theta) {
        this.rotation += theta;
    }

    rotateEach(theta) {
        let e = new THREE.Euler(0, 0, theta, 'XYZ');
        this.verts.forEach( (v,i) => {
            this.verts[i].applyEuler(e)
        })
    }

    forEach(f) {
        this.verts.forEach(f);
    }

    length() {
        return this.verts.length;
    }

    makeCircular(radius, amount) {
        this.verts.forEach( (v, i) => {
            const l = v.length();
            let scaleAmt = radius / l;
            scaleAmt = (scaleAmt * amount) + (1-amount);
            v.multiply(new THREE.Vector3(scaleAmt, scaleAmt, 1));
        });
    }
}

class WireRoundedRect extends DynWire {
    constructor(width, height, cornerRad, cornerVerts) {
        super();

        const radWire = new DynWire();
        const sliceAngle = (Math.PI/2)/cornerVerts;
        for (let i=1; i < cornerVerts; i++) {
            const theta = Math.PI - (sliceAngle * i);

            radWire.add(
                Math.cos(theta)*cornerRad, 
                Math.sin(theta)*cornerRad,
                0);
        }

        let cx, cy = 0;
        cx = width/2 - cornerRad;
        cy = height/2 - cornerRad;

        this.add(-width/2, 0, 0);
        this.add(-width/2, height/2-cornerRad, 0);
        
        // add curve - top left
        radWire.origin.set(-cx, cy, 0);
        this.append(radWire.applyTransforms());
        
        this.add(-width/2+cornerRad, height/2, 0); // A
        this.add(0, height/2, 0);
        this.add(width/2-cornerRad, height/2, 0); // B

        // add curve - top right
        radWire.rotation = -Math.PI/2;
        radWire.origin.set(cx, cy, 0);
        this.append(radWire.applyTransforms());

        this.add(width/2, height/2-cornerRad, 0); // C
        this.add(width/2, 0, 0);
        this.add(width/2, -height/2+cornerRad, 0); // D

        // add curve - bottom right
        radWire.rotation = -Math.PI;
        radWire.origin.set(cx, -cy, 0);
        this.append(radWire.applyTransforms());

        this.add(width/2-cornerRad, -height/2, 0); // E
        this.add(0, -height/2, 0);
        this.add(-width/2+cornerRad, -height/2, 0); // F

        // add curve - bottom left
        radWire.rotate(-Math.PI/2);
        radWire.origin.set(-cx, -cy, 0);
        this.append(radWire.applyTransforms());

        this.add(-width/2, -height/2+cornerRad, 0);
    }


}

class DynGeo {
    constructor() {
        this.vertices = [];
        this.uvs = [];
        this.faces = [];
        this.data = [];
        this.extraAtts = {};
        
        this.geo = null;
    }

    addVert(x, y, z, u, v) {
        this.vertices.push([x,y,z]);
        this.uvs.push([u, v]);
    }
    addData(f) {
        this.data.push(f);
    }

    addFromWire(w) {
        w.forEach(v => {
            this.vertices.push([...v])
        });
    }

    addFace(a, b, c) {
        this.faces.push([a, b, c]);
    }

    finalize() {
        const finalVertsList = [];
        const finalUVsList = [];

        this.faces.forEach(f => {
            f.forEach(vertIndex => {
                finalVertsList.push(...this.vertices[vertIndex]);
                finalUVsList.push(...this.uvs[vertIndex]);
            })
        });

        const finalVerts = new Float32Array(finalVertsList);
        const finalUVs = new Float32Array(finalUVsList);

        const g = new THREE.BufferGeometry();    
        g.setAttribute('position', new THREE.BufferAttribute(finalVerts, 3));
        g.setAttribute('uv', new THREE.BufferAttribute(finalUVs, 2));

        g.setAttribute('data', new THREE.BufferAttribute(
            new Float32Array(this.data), 1));
        
        console.log('verts', this.vertices.length, 'data', this.data);
        this.geo = g;
    }

}

function vertexShader() {
    return `
        varying vec2 vUv; 
        varying float data;
        varying vec3 pos;
        void main() {
            vUv = uv;
            data = data;
            pos = position;
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition; 
        }
    `
  }

function fragmentShader() {
    return `
    uniform vec3 colorA; 
    uniform vec3 colorB;
    uniform float finalZ;

    varying vec2 vUv;
    varying vec3 pos;

    uniform sampler2D texture1;

    void main() {
        vec4 backColor = vec4(mix(colorA, colorB, (pos.z / -2.)), 1.0);
        vec4 texColor = texture2D(texture1, vUv);

        // vec4 texColor = vec4(0., vUv.x, vUv.y, 1.0);

        float mixV = step(0.001, -pos.z);
        
        gl_FragColor = mix(texColor, backColor, mixV);

        // gl_FragColor = backColor;
    }
    `
}

class Console {
    static DIS_RECT = 0;
    static DIS_POLAR = 1;

    static DIS_RASTER = 0;
    static DIS_VECTOR = 1;
    
    constructor() {
        this._genDisplayDetails();        
        this._setupCanvas();

        this._makeGeo();

        this.boxPos = [0,0];
        this.boxDir = [1,1];
    }

    _genDisplayDetails() {
        const p = {};
        
        p.shape = (Math.random() >= 0.3 ? Console.DIS_RECT : Console.DIS_POLAR);
        

        if (p.shape === Console.DIS_RECT) {
            // default, landscape
            p.aspect = Math.random() * 2 + 1;
            p.pixWidth = p.aspect;
            p.pixHeight = 1;

            if (Math.random() > 0.5) {
                // portrait
                p.pixWidth = 1;
                p.pixHeight = p.aspect;
                p.aspect = 1 / p.aspect;
            }

            p.cornerRound = Math.random() * 0.3 + 0.05;

        } else {
            // do stuff for polar displays here
            p.aspect = 1;
            p.pixWidth = 1;
            p.pixHeight = 1;

            p.cornerRound = 0.4999;

        }
        this.displayParams = p;
        console.log(this.displayParams);
    }

    _setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 500;
        this.canvas.height = 500;

        let c = this.ctx;
        c.clearRect(0, 0, 500, 500);
        c.fillStyle = '#888888';
        c.fillRect(0, 0, 500, 500);

        c.fillStyle = '#000000';
        c.fillRect(30, 30, 440, 440);

        this.canvasTex = new THREE.Texture(this.canvas);
        this.canvasTex.needsUpdate = true;
    }

    animate(deltaTime) {
        let c = this.ctx;
        let dp = this.displayParams;

        const speed = 10;
        this.boxPos = [
            this.boxPos[0] + (this.boxDir[0] * speed),
            this.boxPos[1] + (this.boxDir[1] * speed)
        ];

        let boxSize = 50 * dp.pixWidth;
        const xLims = [
            -250,
            245
        ];
        boxSize = 50 * dp.pixHeight;
        const yLims = [
            -250,
            245
        ];

        if (this.boxPos[0] <= xLims[0] || this.boxPos[0] >= xLims[1]) {
            this.boxDir[0] *= -1;
        }
        if (this.boxPos[1] <= yLims[0] || this.boxPos[1] >= yLims[1]) {
            this.boxDir[1] *= -1;
        }

        c.clearRect(0, 0, 500, 500);
        c.fillStyle = '#000000';
        c.fillRect(0, 0, 500, 500);

        c.save();
        c.translate(250, 250);
        c.translate(this.boxPos[0], this.boxPos[1]);

        c.fillStyle = '#aae6ba';
        c.fillRect(-(50/dp.pixWidth), -(50/dp.pixHeight), (100/dp.pixWidth), (100/dp.pixHeight));
        c.restore();
        this.canvasTex.needsUpdate = true;
    }

    _makeGeo() {
        
        let width, height;
        if (this.displayParams.aspect < 1) {
            width = 1;
            height = width / this.displayParams.aspect;
        } else {
            height = 1;
            width = height * this.displayParams.aspect;
        }

        let roundRect = new WireRoundedRect(width, height, this.displayParams.cornerRound, 5);

        let dg = new DynGeo();
        
        // center point of front panel
        dg.addVert(0, 0, 0, 0.5, 0.5);
        dg.addData(0);

        // verts for front panel
        roundRect.forEach( v => {
            dg.addVert(v.x, v.y, 0, v.x/width + 0.5, v.y/height + 0.5);
        });

        /*
        sections to back:
        - curve just after the front
        - sloping down to cylindrical tube
        - straight back
        - dome
        */

        // const numRings = 3;
        let ringCount = 0;
        
        let zPos = 0;
        
        let uSize = 1/(roundRect.length());
        let vSize = 0.2;

                
        function addRing(uvV) {
            const newRing = roundRect.applyTransforms(); 
            newRing.forEach( (v,j) => {
                dg.addVert(v.x, v.y, v.z,
                    (j*uSize), uvV);
            });
            const vtx = newRing.verts[0];
            dg.addVert(vtx.x, vtx.y, vtx.z,
                1, uvV);

            ringCount++;
        }

        // verts for sides
        // add a copy of the outer ring

        addRing(0);

        
        const edgeRad = this.displayParams.cornerRound * 0.5;
        const edgeVerts = 5;
        for (let i=0; i < edgeVerts; i++) {
            const theta = (i + 1) * ((Math.PI / 2) / edgeVerts);
            
            const x = Math.cos(theta) * edgeRad;
            const y = Math.sin(theta) * edgeRad;
            roundRect.setScale(1+y,1+y,1);
            roundRect.setTranslate(0, 0, -edgeRad + x);

            addRing((i+1)*vSize);
        }
        roundRect = roundRect.applyTransforms();

        // slope down to cylinder
        const slopeVerts = 20;
        const slopeDist = 1; // Math.random()  * 0.4 + 0.1;
        const slopeReduceTarget = (Math.random() * 0.4) + 0.3; 
        const scaleStart = roundRect.baseScale.x;
        const scaleEach = 1 - ((scaleStart - slopeReduceTarget) / slopeVerts);

        const finalRad = Math.min(width, height) * slopeReduceTarget;

        function slopeShape(x) {
            return 1.0 - Math.pow(Math.abs(Math.sin(x * Math.PI/2)), 3.5);
        }

        for (let i=0; i < slopeVerts; i++) {

            let sU = slopeShape(i / (slopeVerts-1));
            let s = (sU * scaleStart) + (1-sU) * slopeReduceTarget;

            roundRect.makeCircular(finalRad, 1-sU);

            roundRect.setScale(s, s, 1);
            roundRect.origin.set(0, 0, -(i/(slopeVerts-1)) * slopeDist);
            addRing(0);
        }
        roundRect = roundRect.applyTransforms();

        const backTubeLen = Math.min(width, height) * ((Math.random() * 1) + 0.1);
        // const backTubeLen = Math.min(width, height) * 0.1;
        roundRect.translate(0, 0, -backTubeLen);
        addRing(0);

        // add final cap
        const capVerts = 10;
        const startScale = roundRect.baseScale.x;
        const startZ = roundRect.origin.z;
        for (let i=0; i < capVerts; i++) {
            const theta = ((i + 1) * ((Math.PI / 2) / capVerts)) + (Math.PI/2);
            
            const x = Math.cos(theta) * 0.2;
            const y = Math.sin(theta);
            
            let cU = i / (capVerts-1);

            let s = (1-cU) * startScale;
            s = startScale * y;

            // roundRect.setScale(startScale*(1-y),startScale*(1-y),1);
            roundRect.setScale(s, s, 1);
            // roundRect.translate(0, 0, -x);
            roundRect.origin.set(0, 0, startZ + x);

            // roundRect.setScale(1+y,1+y,1);
            // roundRect.setTranslate(0, 0, -edgeRad + x);

            addRing(0);
        }


        // last vert at end 
        let finalZ = roundRect.applyTransforms().verts[0].z-0.;
        dg.addVert(0, 0, finalZ, 0, 0);

        const frontVerts = roundRect.length() + 1;

        ///// ADDING FACES //////

        // front panel
        for (let i=0; i < roundRect.length(); i++) {
            let i1 = i + 1;
            let i2 = ((i + 1) % roundRect.length()) + 1;          
            dg.addFace(0, i2, i1);
        }

        // main body
        for (let i=0; i < ringCount-1; i++) {
            /*
                B-C
                |/|
                A-D

                N-N+1
                |/|
                0-1
            */
            let yCurr = frontVerts + (i * (roundRect.length() + 1));
            let yNext = yCurr + (roundRect.length() + 1);
                
            for (let j=0; j < roundRect.length(); j++) {
                let xCurr = j;
                let xNext = (j + 1);
                
                let a = yCurr + xCurr;
                let b = yNext + xCurr;
                let c = yNext + xNext;
                let d = yCurr + xNext;

                dg.addFace(a, c, b);
                dg.addFace(a, d, c);
            }
        }

        // final cap
        let base = (roundRect.length()+1) * (ringCount);
        let capVert = base + roundRect.length() + 1;
        
        for (let i=0; i < roundRect.length(); i++) {
            let i1 = i+1;
            let i2 = ((i + 1) % roundRect.length()) + 1;
            dg.addFace(capVert, base+i1, base+i2);
        }
        dg.finalize();


        ////// SHADER SETUP ///////

        let uniforms = {
            colorB : {type: 'vec3', value: new THREE.Color('#444')},
            colorA : {type: 'vec3', value: new THREE.Color('#AAA')},
            texture1: {type: 't', value: this.canvasTex},
            totalZ: {value: finalZ}
        }

        console.log('finalZ', finalZ);

        this.mat = new THREE.MeshBasicMaterial({
            color : '#000000',
            // map: this.canvasTex,
            wireframe: true
        });
        
        this.shader = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: fragmentShader(),
            vertexShader: vertexShader()
        });

        this.mesh = new THREE.Mesh(dg.geo, this.shader);
    }

    addToScene(s) {
        s.add(this.mesh);
    }

}