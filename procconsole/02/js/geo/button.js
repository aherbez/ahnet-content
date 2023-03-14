class GamepadButton {
    constructor() {
        this.mesh = null;

        this._makeGeo();

    }

    _makeGeo() {
        let dg = new DynGeo();

        const params = {
            sides: Math.floor(Math.random() * 4) + 3
        }

        let baseWire = new WirePolygon(params.sides, 1, 0.2);
        console.log('basewire len: ', baseWire.length);
        dg.addVert(0, 0, 0, 0.5, 0.5);
        dg.addVertsFromWire(baseWire);

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
            dg.addVertsFromWire(baseWire.applyTransforms());
        }
        baseWire = baseWire.applyTransforms();
        
        baseWire.translate(0, 0, -1);
        dg.addVertsFromWire(baseWire.applyTransforms());

        // FACES
        dg.addFan(0, 1, baseWire.length);

        // sides
        for (let i=0; i < bevelVerts; i++) {
            dg.addQuadsBetweenWires(baseWire.length,
                1+(baseWire.length*i),
                ((baseWire.length*(i+1))+1));
        }

        dg.finalize();


        this.mat = new THREE.MeshBasicMaterial({
            color: 'black',
            wireframe: true
        })

        this.normalMat = new THREE.MeshNormalMaterial();

        this.mesh = new THREE.Mesh(dg.geo, this.normalMat);
        // this.mesh.rotation.x = Math.PI/2;
        console.log(this.mesh);
    }

    addTo(s) {
        if (this.mesh) {
            s.add(this.mesh);
        }
    }
}