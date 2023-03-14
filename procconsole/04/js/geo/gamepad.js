/*
COLORS;

dark green: #0c7548 | [0, 0.78, 0.329]
light green: #1ec181 | [0.004, 0.925, 0.094]

*/



class Gamepad {
    constructor() {
        this.buttons = [];
        this.buttonPos = [];

        this.numButtons = Math.floor(Math.random() * 5) + 3;

        this.root = new THREE.Group();
        this.buttonSharpness = Math.random() * 0.4;

        for (let i=0; i < this.numButtons; i++) {
            this.addButton();
        }

        this._addBase();
    }

    _nextPos(i) {
        if (i === 0) {
            return new THREE.Vector2(0,0);
        } else if (i === 1) {
            let v = new THREE.Vector2(0.5, Math.sqrt(3)/2);
            v.normalize();
            const mag = (this.buttons[0].radius + this.buttons[1].radius) * 2;
            v = v.multiplyScalar(mag);
            return v; 
        }

        let diff = this.buttonPos[i-1].clone();
        diff.sub(this.buttonPos[i-2]);

        const ratio = this.buttons[i-1].radius / (this.buttons[i-1].radius + this.buttons[i-2].radius);

        let pos = this.buttonPos[i-2].clone();
        pos.lerp(this.buttonPos[i-1], ratio);

        let perp = new THREE.Vector2(diff.y, -diff.x);
        if ((i % 2) === 1) {
            perp.set(-diff.y, diff.x);
        }

        perp.normalize();

        let newMag = Math.max(this.buttons[i-1].radius, this.buttons[i-2].radius) + this.buttons[i].radius;
        newMag *= 2;
        perp.multiplyScalar(newMag);
        return pos.add(perp);
    }

    addButton() {
        let i = this.buttons.length;
        
        let r = Math.random()/2 + 0.4;
        
        let b = new GamepadButton(r, this.buttonSharpness);
        this.buttons.push(b);

        let newPos = this._nextPos(i);
        this.buttonPos.push(newPos);

        b.root.position.x = newPos.x;
        b.root.position.y = newPos.y;

        b.addTo(this.root);
    }

    setButtonState(index, state) {
        if (index < 0 || index >= this.buttons.length) return;
        this.buttons[index].pressed = state;
    }

    _addBase() {
        const numVerts = this.buttons.length;

        let baseShape = new DynWire();

        baseShape.add(this.buttonPos[0].x, this.buttonPos[0].y, 0);
        for (let i=1; i < this.buttons.length-1; i += 2) {
            baseShape.add(this.buttonPos[i].x, this.buttonPos[i].y, 0);
        }

        baseShape.add(this.buttonPos[numVerts-1].x, this.buttonPos[numVerts-1].y, 0);

        const lastEven = (numVerts - 1) - 2 + ((numVerts-1) % 2);
        for (let i = lastEven; i > 0; i -= 2) {
            baseShape.add(this.buttonPos[i].x, this.buttonPos[i].y, 0);
        }

        baseShape = baseShape.expand(2);
        baseShape = baseShape.roundCorners(0.2, 3);

        let dg = new DynGeo();

        // baseShape.translate(0, 0, -1.);
        baseShape = baseShape.applyTransforms();

        let pt = baseShape.center;
        dg.addVert(pt.x, pt.y, pt.z, 0.5, 0.5);

        dg.addVertsFromWire(baseShape.applyTransforms(), false);
        baseShape.forEach(() => {
            dg.addUVs(0, 0);
        });

        baseShape.translate(0, 0, -0.2);
        baseShape = baseShape.applyTransforms();
        dg.addVertsFromWire(baseShape, false);
        baseShape.forEach(() => {
            dg.addUVs(0, 0);
        });

        pt = baseShape.center;
        dg.addVert(pt.x, pt.y, pt.z, 0.5, 0.5);

        dg.addFan(0, 1, baseShape.length, true);
        dg.addQuadsBetweenWires(baseShape.length, 1, baseShape.length+1, true);

        dg.addFan(baseShape.length*2+1, baseShape.length+1, baseShape.length*2, false);

        const addFlatFaces = (a,b,c) => {
            dg.addFace(a, b, c);
            dg.addFace(
                a + numVerts,
                c + numVerts,
                b + numVerts
            );
        }

        const numTris = numVerts - 2;
        let top = 1;
        let bot = numVerts-1;
        let c = 0;
        // addFlatFaces(bot, top, c);

        for (let i=1; i < numTris; i++) {
            if (i % 2 === 1) {
                c = top + 1;
                // addFlatFaces(c, top, bot);
                top = c;
            } else {
                c = bot - 1;
                // addFlatFaces(c, top, bot);
                bot = c;
            }
        }

        dg.finalize();

        this.normalMat = new THREE.MeshNormalMaterial();

        /*
        this.shader = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: fragmentShader(),
            vertexShader: vertexShader()
        });
        */

        this.baseMat = new THREE.MeshBasicMaterial({
            color: '#0c7548',
            wireframe: false
        });

        this.baseMesh = new THREE.Mesh(dg.geo, this.baseMat);
        this.baseMesh.position.z = -0.7;       
        
        this.root.add(this.baseMesh);
        
    }

    addTo(s) {
        s.add(this.root);
    }
}