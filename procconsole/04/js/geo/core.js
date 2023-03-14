class DynWire {
    constructor() {
        this.verts = [];
        this.origin = new THREE.Vector3();
        this.baseScale = new THREE.Vector3(1, 1, 1);
        this.rotation = 0;

        this._pointsDirty = true;
        this._center = new THREE.Vector3();

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
        this._pointsDirty = true;
    }

    append(wire) {
        wire.verts.forEach(v => {
            this.add(v.x, v.y, v.z);
        });

        this._pointsDirty = true;
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
        dw._pointsDirty = true;
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

    get length() {
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

    expand(amt) {
        let newWire = new DynWire();
        this.forEach((v, i) => {
            let prev = (i - 1);
            if (prev < 0) prev = this.length - 1;
            let next = (i + 1) % this.length;

            let toPrev = this.verts[prev].clone();
            toPrev.sub(this.verts[i]);

            let toNext = this.verts[next].clone();
            toNext.sub(this.verts[i]);

            // make perp vectors
            toPrev.set(toPrev.y, -toPrev.x, 0);
            toNext.set(-toNext.y, toNext.x, 0);

            toPrev.normalize();
            toNext.normalize();

            let offsetVec = toPrev.clone();
            offsetVec.add(toNext);
            offsetVec.multiplyScalar(0.5);
            offsetVec.multiplyScalar(amt);

            offsetVec.add(this.verts[i]);

            newWire.add(offsetVec.x, offsetVec.y, offsetVec.z);
        });
        return newWire;
    }

    roundCorners(amt, facets) {
        let newWire = new DynWire();
        this.forEach((v,i) => {
            let prev = (i - 1);
            if (prev < 0) prev = this.length - 1;
            let next = (i + 1) % this.length;

            let a = v.clone();
            a.lerp(this.verts[prev], amt);

            let c = v.clone();
            c.lerp(this.verts[next], amt);

            newWire.add(a.x, a.y, a.z);
            
            for (let j=1; j <= facets; j++) {
                const u = j / (facets + 1);

                const p = a.clone();
                p.lerp(v, u);

                const q = v.clone();
                q.lerp(c, u);

                p.lerp(q, u);
                newWire.add(p.x, p.y, p.z);
            }
            
            newWire.add(c.x, c.y, c.z);

        });
        return newWire;
    }

    get center() {
        if (this._pointsDirty) {
            this._center.set(0, 0, 0);

            this.forEach(v => {
                this._center.add(v);
            });

            this._center.multiplyScalar(1 / this.length);
            this._pointsDirty = false;
        }
        return this._center;
    }
}

class WirePolygon extends DynWire {
    constructor(sides, radius, cornerRad=0) {
        super();

        const theta = (Math.PI * 2) / sides;
        const sideLen = Math.cos(theta/2) * radius * 2;
        const thetaOffset = Math.PI/4;

        for (let i=0; i < sides; i++) {

            let prevPt = new THREE.Vector2(
                Math.cos((i-1) * theta + thetaOffset) * radius,
                Math.sin((i-1) * theta + thetaOffset) * radius
            );
            
            let currPt = new THREE.Vector2(
                Math.cos(i * theta + thetaOffset) * radius,
                Math.sin(i * theta + thetaOffset) * radius
            );
    
            let nextPt = new THREE.Vector2(
                Math.cos((i+1) * theta + thetaOffset) * radius,
                Math.sin((i+1) * theta + thetaOffset) * radius
            );

            const c = new THREE.Vector2(
                Math.cos(theta * i + thetaOffset) * radius,
                Math.sin(theta * i + thetaOffset) * radius
            );
            
            // back towards prev
            let a = currPt.clone();
            let b = currPt.clone();

            a.lerp(prevPt, cornerRad);
            b.lerp(nextPt, cornerRad);

            this.add(a.x, a.y, 0);
            // this.add(currPt.x, currPt.y, 0);
            
            const bevelVerts = 3;
            for (let j=1;  j <= bevelVerts; j++) {
                let u = j * (1/(bevelVerts+1));

                let p1 = a.clone();
                p1.lerp(currPt, u);

                let p2 = currPt.clone();
                p2.lerp(b, u);

                p1.lerp(p2, u);

                this.add(p1.x, p1.y, 0);
            }
            this.add(b.x, b.y, 0);
            
        }

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

    addUVs(u, v) {
        this.uvs.push([u,v]);
    }

    addData(f) {
        this.data.push(f);
    }

    addFromWire(w) {
        w.forEach(v => {
            this.vertices.push([...v])
        });
    }

    addVertsFromWire(w, addUvs=true) {
        w.forEach((v,i) => {
            if (addUvs) {
                this.addVert(v.x, v.y, v.z, (i / w.length), 0);
            } else {
                this.vertices.push([v.x, v.y, v.z]);
            }
        })
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
        g.computeVertexNormals();
        this.geo = g;
    }

    addFan(centerIndex, startIndex, endIndex, flipOrder=false) {
        const span = (endIndex - startIndex) + 1;

        for (let i=0; i < span; i++) {
            let i1 = startIndex + i;
            let i2 = startIndex + ((i+1) % span);

            if (flipOrder) {
                this.addFace(centerIndex, i2, i1);
            } else {
                this.addFace(centerIndex, i1, i2);
            }
        }
    }

    addQuadsBetweenWires(wireVerts, offsetA, offsetB, flipOrder=false) {
        for (let i=0; i < wireVerts; i++) {
            /*
                1-2
                |/|
                4-3
            */
            let i1 = i + offsetA;
            let i2 = ((i + 1) % wireVerts) + offsetA;
            let i3 = ((i + 1) % wireVerts) + offsetB;
            let i4 = i + offsetB;

            if (flipOrder) {
                this.addFace(i4, i1, i2);
                this.addFace(i2, i3, i4);
    
            } else {
                this.addFace(i4, i2, i1);
                this.addFace(i2, i4, i3);    
            }
        }       
    }

}