function vertexShader() {
    return `
        varying vec2 vUv; 
        varying vec3 pos;

        void main() {
            vUv = uv;
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

        varying vec2 vUv;
        varying vec3 pos;

        uniform sampler2D texture1;

        void main() {
            vec3 darkerColor = colorA * 0.8;

            vec3 backColor = mix(darkerColor, colorA, pos.z);

            // float cent = sqrt(vUv - vec2(0.5, 0.4));

            vec4 texColor = texture2D(texture1, vUv);

            gl_FragColor = texColor; // vec4(mix(screenColor, backColor, mixV), 1.0);
            gl_FragColor = vec4(backColor, 1.);
        }
    `
}

class GamepadButton {
    constructor(radius=1, sharpness=0.2) {

        this.root = new THREE.Group();

        this.btn = null;

        this._genParams(radius, sharpness);

        this._setupCanvas();
        this._makeGeo();

    }

    _genParams(r, sharp) {
        this.params = {
            sides: Math.floor(Math.random() * 4) + 4,
            radius: r,
            corner: sharp
        }
        if (this.params.sides > 6 ) {
            // this.params.sides = 12;
        }
    }

    get radius() {
        return this.params.radius;
    }
    
    _setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 500;
        this.canvas.height = 500;

        let c = this.ctx;
        c.clearRect(0, 0, 500, 500);
        c.fillStyle = '#AAA';
        c.fillRect(0, 0, 500, 500);

        const gridNum = 10;
        const gridPix = 500 / gridNum;

        c.fillStyle = '#222222';
        for (let i=0; i < gridNum; i++) {
            for (let j=0; j < gridNum; j++) {
                if ((i+j) % 2 === 0) {
                    c.fillRect(i*gridPix, j*gridPix, gridPix, gridPix);
                }
            }
        }

        /*
        c.save();
        c.fillStyle = "#00F";
        c.translate(250,250);
        // c.rotate(Math.PI/4);
        c.fillRect(-250, -10, 500, 20);
        c.restore();
        */
        
        c.save();
        c.translate(0, 400);
        c.fillStyle = 'red';
        c.fillRect(0, 0, 500, 100);
        c.restore();

        this.canvasTex = new THREE.Texture(this.canvas);
        this.canvasTex.needsUpdate = true;
    }
    
    _makeGeo() {
        let dg = new DynGeo();

        const vExtents = 0.8;
        const uExtents = 1.0;

        let baseWire = new WirePolygon(this.params.sides,
            this.params.radius,
            this.params.corner
        );
        
        const addUVs = (vtx) => {
            /*
            min: -radius
            max: radius
            extents = max - min = radius * 2
            */
            let u = (vtx.x / (this.params.radius * 4))
            u += 0.5;
            // u *= uExtents;

            let v = (vtx.y / (this.params.radius * 4))
            v += 0.5;
            v *= vExtents;
            v += 1. - vExtents;

            dg.addUVs(u,v);
        }

        dg.addVert(0, 0, 0, 0.5, vExtents/2 + (1.-vExtents));
        dg.addVertsFromWire(baseWire, false);
        baseWire.forEach(addUVs);

        const rad = 0.4;
        // round edge
        const bevelVerts = 5;
        for (let i=1; i < bevelVerts; i++) {
            const theta = i * ((Math.PI / 2) / bevelVerts);
            const x = Math.cos(theta);
            const y = Math.sin(theta);
            
            const s = 1 + y;
            baseWire.setScale(s, s, 1);
            baseWire.setTranslate(0, 0, -(1-x)*rad);
            const currWire = baseWire.applyTransforms();
            dg.addVertsFromWire(currWire, false);
            currWire.forEach(addUVs);
        }

        const addWrapUVs = (uvV) => {
            const f = ( (vtx, i) => {
                const u = (i / (baseWire.length - 1));
                dg.addUVs(u, uvV);
            });
            return f;
        };
        baseWire = baseWire.applyTransforms();

        dg.addVertsFromWire(baseWire, false);
        baseWire.forEach(addWrapUVs(0.2));
        
        baseWire.translate(0, 0, -0.6);
        baseWire = baseWire.applyTransforms();
        dg.addVertsFromWire(baseWire);
        baseWire.forEach(addWrapUVs(0));

        let pt = baseWire.center;
        dg.addVert(pt.x, pt.y, pt.z, 0.5, 0.5);

        // FACES
        dg.addFan(0, 1, baseWire.length);

        // sides
        for (let i=0; i < bevelVerts; i++) {
            dg.addQuadsBetweenWires(baseWire.length,
                1+(baseWire.length*i),
                ((baseWire.length*(i+1))+1));
        }
        
        dg.addQuadsBetweenWires(baseWire.length,
            1+(baseWire.length*bevelVerts),
            ((baseWire.length*(bevelVerts+1))+1));
        
        
        dg.addFan(baseWire.length*(bevelVerts + 2)+1,
            baseWire.length*(bevelVerts + 1)+1,
            baseWire.length*(bevelVerts + 2),
            true);
        
        dg.finalize();

        this.mat = new THREE.MeshBasicMaterial({
            color: 'black',
            wireframe: true
        });

        let uniforms = {
            colorA : {type: 'vec3', value: new THREE.Color(Math.random(), Math.random(), Math.random())},
            colorB : {type: 'vec3', value: new THREE.Color('#444')},
            texture1: {type: 't', value: this.canvasTex}
        }

        this.normalMat = new THREE.MeshNormalMaterial();

        this.shader = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: fragmentShader(),
            vertexShader: vertexShader(),
            wireframe: false
        });

        this.btn = new THREE.Mesh(dg.geo, this.shader);
        this.btn.position.z = 1;
        this.root.add(this.btn);

        this.base = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1,1,0.5),
            new THREE.MeshBasicMaterial({
                color: 'black'
            })
        );
        this.base.position.z = -0.5;
        this.root.add(this.base);

        this.post = new THREE.Mesh(
            new THREE.CylinderBufferGeometry(0.2, 0.2, 0.7),
            new THREE.MeshBasicMaterial({
                color: 'gray'
            })
        );
        this.post.rotation.x = Math.PI/2;
        this.root.add(this.post);
    }

    set pressed(isPressed) {
        if (isPressed) {
            this.btn.position.z = 0.5;
        } else {
            this.btn.position.z = 1.2;
        }
    }

    addTo(s) {
        s.add(this.root);
    }
}