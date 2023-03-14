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

    _addVerticesFromEdge(edge, ypos, v)
    {
        edge.vertices.forEach(v => {
            this.addVertex(
                v.pos[0], ypos, v.pos[1],
                v.uval, v,
                [v.normal[0], 0, v.normal[1]]
            );
        });
    }

    extrudeEdge(edge, thickness, height, v1, v2)
    {
        let vmin = v1 || 0;
        let vmax = v2 || 1;

        let botOuter = edge;
        botOuter.flipNormals();
        let botInner = edge.copy();
        botInner.flipNormals();
        botInner.adjustSize(-thickness);
        // botInner.reverse();
        

        let numPoints = edge.numPoints;

        this._addVerticesFromEdge(botOuter, 0, vmin);
        this._addVerticesFromEdge(botInner, 0, vmin);
        this._addVerticesFromEdge(botOuter, height, vmax);
        this._addVerticesFromEdge(botInner, height, vmax);

        let s1 = 0;             // botOuter
        let s2 = numPoints;     // botInner
        let s3 = numPoints*2;   // topOuter
        let s4 = numPoints*3;   // topInner

        let indices = [];
        for (let i=1; i < numPoints; i++)
        {
            // outer wall
            indices.push(
                s1+i, s3+(i-1), s3+i,
                s1+i, s1 + (i-1), s3+(i-1)
            );
            
            // inner wall
            indices.push(
                s2+i, s4+i, s4+(i-1),
                s2+i, s4+(i-1), s2 + (i-1),                      
            );
            
            // top cap
            indices.push(
                s4+i, s3 + i, s3 + (i-1),
                s4+i, s3 + (i-1), s4 + (i-1), 
            );

            // bottom cap
            indices.push(
                s2+i, s1 + (i-1), s1 + i,
                s2+i, s2 + (i-1), s1 + (i-1), 
            );
        }

        // start face
        indices.push(
            s2, s4, s3,
            s2, s3, s1
        );
       
        s1 += (numPoints-1);
        s2 += (numPoints-1);
        s3 += (numPoints-1);
        s4 += (numPoints-1);

        // end face
        indices.push(
            s2, s3, s4,
            s2, s1, s3,
        );

        this.faceIndices = this.faceIndices.concat(indices);
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