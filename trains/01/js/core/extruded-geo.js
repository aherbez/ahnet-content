class ExtrudedGeometry extends DynamicModel
{
    constructor(gl, polygon)
    {
        super(gl, null, true);

        this._polygon = polygon;
    }


    _addVertexRing(polygon, ypos)
    {
        polygon.points.forEach((p,i) => {
            this.addVertex(
                p[0], ypos, p[1],
                polygon._uvals[i], (ypos > 0) ? 1 : 0,
                [polygon.normals[i][0], 0, polygon.normals[i][1]]
            );
        });
    }


    extrudeShell(h, thickness, extrudeMode)
    {
        let outer = this._polygon;
        outer.flipNormals();
        let inner = outer.copy();
        inner.shrink(thickness);
        // inner.reverse();
        // inner.flipNormals();

        let verts = [];
        let normals = [];
        let uvs = [];

        this._addVertexRing(outer, 0);
        this._addVertexRing(inner, 0);
        this._addVertexRing(outer, h);
        this._addVertexRing(inner, h);

        let botOut = 0;
        let botIn = outer.numPoints;
        let topOut = (outer.numPoints * 2);
        let topIn = (outer.numPoints * 3);

        let indices = [];

        // console.log(outer.numPoints, botOut, botIn, topOut, topIn);

        let u1, u2;
        for (let i=0; i < outer.numPoints; i++)
        {
            u1 = i;
            u2 = (i + 1) % outer.numPoints;

            // bottom cap
            if (extrudeMode & 1)
            {
                indices.push(
                    botOut + u1, botIn + u2, botIn + u1,
                    botOut + u1, botOut + u2, botIn + u2,
                );
            }

            // top cap
            if (extrudeMode & 2)
            {
                indices.push(
                    topOut + u1, topIn + u1, topIn + u2, 
                    topOut + u1, topIn + u2, topOut + u2, 
                );
            
            }

            // walls
            if (extrudeMode & 4)
            {
                // outer wall
                indices.push(
                    botOut + u1, topOut + u1, topOut + u2, 
                    botOut + u1, topOut + u2, botOut + u2,   
                );
                
                // inner wall
                indices.push(
                    botIn + u1, topIn + u2, topIn + u1, 
                    botIn + u1, botIn + u2, topIn + u2,  
                );

            }
        }

        this.faceIndices = this.faceIndices.concat(indices);

        /*
        console.log('vertexPositions', this.vertexPositions);
        console.log('uvs', this.textureCoords);
        console.log('normals', this.normals);
        console.log('face indices', this.faceIndices);
        */
    }

    extrude(h, extrudeMode)
    {
        let p = this._polygon;

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
}