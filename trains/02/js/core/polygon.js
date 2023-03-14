class Vertex2d
{
    constructor(x, y)
    {
        let xval = x || 0;
        let yval = y || 0;

        this.pos = vec2.fromValues(x,y);
        this.uval = 0;
        this.data = 0;
        this.normal = vec2.create();
    }

    moveAlongNormal(amt)
    {
        this.pos[0] += this.normal[0] * amt;
        this.pos[1] += this.normal[1] * amt;
    }

    copy()
    {
        let v = new Vertex2d(this.pos[0], this.pos[1]);
        v.uval = this.uval;
        v.data = this.data;
        v.normal = vec2.clone(this.normal);
        return v;
    }

    flipNormal()
    {
        vec2.negate(this.normal, this.normal);
    }
}

class EdgeList
{
    constructor(data)
    {
        this._vertices = [];
        this._data = data;
    }

    get vertices() { return this._vertices; }
    get data() { return this._data; }
    get numPoints() { return this._vertices.length; }
    get first() { return this._vertices[0]; }
    get last() { return this._vertices[this.numPoints-1]; }

    addVertex(v)
    {
        this._vertices.push(v);
    }

    addPointFromData(pos, uval, normal)
    {
        let v = new Vertex2d(pos[0], pos[1]);
        v.uval = uval;
        v.normal = normal;
        this.addVertex(v);
    }

    concat(vertices)
    {
        this._vertices = this._vertices.concat(vertices);
    }

    concatEdge(e)
    {
        this.concat(e.vertices);
    }

    copy()
    {
        let el = new EdgeList(this.data);
        this._vertices.forEach(v => {
            el.addVertex(v.copy());
        });
        return el;
    }

    adjustSize(amt)
    {
        this._vertices.forEach(v => {
            v.moveAlongNormal(amt);
        });
    }

    reverse()
    {
        this._vertices.reverse();
    }

    flipNormals()
    {
        this._vertices.forEach(v => {
            v.flipNormal();
        });
    }

}

/**
 * 
 * A 2d polygon
 */
class Polygon
{
    constructor()
    {
        this._points = [];
        this._pointData = [];
        this._normals = [];
        this._uvals = [];

        this._vertices = [];

        this._center = vec2.create();
        this._isDirty = true;
    }

    get numPoints()
    {
        return this._points.length;
    }

    get points()
    {
        return this._points;
    }

    reverse()
    {
        this._points.reverse();
        this._vertices.reverse();
    }

    flipNormals()
    {
        if (this._isDirty)
        {
            this._refresh();
        }

        this._normals.forEach(n => {
            n[0] = n[0] * -1;
            n[1] = n[1] * -1;
        });
    }

    setPointData(i, dat)
    {
        this._pointData[i] = dat;
    }

    floodPointData(dat)
    {
        for (let i=0; i < this.numPoints; i++)
        {
            this._pointData[i] = dat;
        }
    }

    addPoint(p)
    {
        this._points.push(p);
        this._pointData.push(0);
        this._normals.push(vec2.create());
        this._uvals.push(0);

        let v = new Vertex2d(p[0], p[1]);
        this._vertices.push(v);

        this._isDirty = true;
    }

    get center()
    {
        if (this._isDirty) this._refresh();

        return this._center;
    }

    _calcCenter()
    {
        vec2.set(this._center, 0, 0, 0); 

        if (this._points.length > 0)
        {
            for (let i=0; i < this.numPoints; i++)
            {
                vec2.add(this._center, this._center, this._points[i]);
            }

            vec2.divide(this._center, this._center, vec2.fromValues(this.numPoints, this.numPoints));    
        }
    }

    _calcNormals()
    {
        let upVec = vec3.fromValues(0, 0, 1);
        let toNext = vec3.create();
        let toPrev = vec3.create();
        let xyDiff = vec2.create();
        
        let nextP;
        let prevP;
        let currP;

        let normalNext = vec3.create();
        let normalPrev = vec3.create();

        nextP = this.nextPoint(0);
        prevP = this.prevPoint(0);
        currP = this.pointAt(0);

        let normal = vec3.create();

        let all2s = vec3.fromValues(2, 2, 2);

        for (let i=0; i < this.numPoints; i++)
        {

            vec2.sub(xyDiff, nextP, currP);
            vec3.set(toNext, xyDiff[0], xyDiff[1], 0);
            vec3.cross(normalNext, toNext, upVec);
            
            vec2.sub(xyDiff, prevP, currP);
            vec3.set(toPrev, xyDiff[0], xyDiff[1], 0);
            vec3.cross(normalPrev, upVec, toPrev);
            
            vec3.set(normal, normalNext[0], normalNext[1], normalNext[2]);
            vec3.add(normal, normal, normalPrev);
            vec3.divide(normal, normal, all2s);

            vec3.normalize(normal, normal);

            this._normals[i] = vec2.fromValues(normal[0], normal[1]);
        
            prevP = currP;
            currP = nextP;
            nextP = this.nextPoint(i+1);
        }

    }

    _setUVals()
    {
        let currDist = 0;
        let totalDist = 0;

        this._uvals = [];
        this._uvals[0] = 0;

        for (let i=1; i < this.numPoints; i++)
        {
            currDist = vec2.distance(this._points[i], this._points[i-1]);
            totalDist += currDist;
            this._uvals[i] = totalDist;
        }

        for (let i=0; i < this.numPoints; i++)
        {
            this._uvals[i] /= totalDist;
        }
    }

    _adjustSize(s)
    {
        // need fresh normals
        if (this._isDirty)
        {
            this._refresh();
        }

        let scaleVec = vec2.fromValues(s, s);
        let offset = vec2.create();

        for (let i=0; i < this.numPoints; i++)
        {
            vec2.set(offset, this._normals[i][0], this._normals[i][1]);
            vec2.mul(offset, offset, scaleVec);

            vec2.add(this._points[i], this._points[i], offset);
        }
        this._isDirty = true;        
    }

    makeShell(thickness)
    {
        // need fresh normals
        if (this._isDirty)
        {
            this._refresh();
        }

        let shell = new Polygon();
        let innerPoints = [];
        let newPoint = vec2.create();

        this._points.forEach((p,i) => {
            shell.addPoint(vec2.clone(p));

            vec2.copy(newPoint, p);
        
            newPoint[0] = this._normals[i][0] * -thickness + p[0];
            newPoint[1] = this._normals[i][1] * -thickness + p[1];

            innerPoints.push(vec2.clone(newPoint));
        });

        // double up on the start vert
        shell.addPoint(vec2.clone(this._points[0]));
        innerPoints.push(vec2.clone(innerPoints[0]));

        innerPoints.reverse();
        innerPoints.forEach(p => {
            shell.addPoint(p);
        });

        return shell;
    }

    shrink(s)
    {
        this._adjustSize(-s);
    }

    expand(s)
    {
        this._adjustSize(s);
    }

    _refresh()
    {
        this._calcCenter();
        this._calcNormals();
        this._setUVals();
        this._isDirty = false;
    }

    get normals()
    {
        if (this._isDirty)
        {
            this._refresh();
        }
        return this._normals;
    }

    normalFor(i)
    {
        if (this._isDirty)
        {
            this._refresh();
        }
        return this._normals[i];
    }

    pointAt(i)
    {
        if (i < 0 || i >= this._points.length) 
        {
            console.error(`index ${i} out of bounds (0 - ${this._points.length-1})`);
            return null;
        }

        return this._points[i];
    }

    prevPoint(i)
    {
        let index = i - 1;
        if (index < 0) index = this._points.length - 1;
        
        return this._points[index];
    }

    nextPoint(i)
    {
        let index = (i + 1) % this._points.length;
        return this._points[index];
    }

    prevIndex(i)
    {
        if (i < 0 || i >= this.numPoints)
        {
            console.error(`index ${i} out of bounds`);
            return -1;
        }
        let index = i - 1;
        if (index < 0) index = this.numPoints - 1;
        return index;
    }

    nextIndex(i)
    {
        if (i < 0 || i >= this.numPoints)
        {
            console.error(`index ${i} out of bounds`);
            return -1;
        }
        return (i + 1) % this.numPoints;
    }

    copy()
    {
        let polygon = new Polygon();

        this._points.forEach(p => {
            polygon.addPoint(vec2.clone(p));
        });

        polygon._refresh();
        return polygon;
    }


    getIntersectAtAngle(theta, origin)
    {
        let start = origin || this.center;
        let endpoint = vec2.fromValues(
            Math.cos(theta) * 1000,
            Math.sin(theta) * 1000
        );
        vec2.add(endpoint, endpoint, start);

        let cutLine = new Line2d(start, endpoint);

        return this.intersectLine(cutLine);
    }

    addFeatureAtIntersection(line, featureWidth, featureDat)
    {
        let intersectionIndex;

        intersectionIndex = this.addPointAtIntersection(line);
        if (intersectionIndex != -1)
        {
            this.addFeatureAt(intersectionIndex, featureWidth, featureDat);

        }
    }


    addFeatureAt(index, featureWidth, featureDat)
    {
        let halfW = featureWidth/2;

        this._walkUntil(index, halfW, -1, featureDat);
        this._walkUntil(index+1, halfW, 1, featureDat);
        this._refresh();
    }

    // return an array of edges, broken up by data
    getEdges()
    {
        let e = [];

        // console.log(this._pointData);

        let currData = this._pointData[0];
        let currEdge = new EdgeList(currData);
        currEdge.addPointFromData(
            this._points[0],
            this._uvals[0],
            this._normals[0]
        );

        for (let i=1; i < this.numPoints; i++)
        {
            if (this._pointData[i] != currData)
            {
                currEdge.addPointFromData(
                    this._points[i],
                    this._uvals[i],
                    this._normals[i]
                );  
                e.push(currEdge);
                currData = this._pointData[i];
                currEdge = new EdgeList(currData);
            }
            currEdge.addPointFromData(
                this._points[i],
                this._uvals[i],
                this._normals[i]
            );    
        }
        e.push(currEdge);

        if (e.length > 1 && e[0].data === e[e.length-1].data)
        {
            console.log('wrap around!');
            let firstEdge = e.shift();

            e[e.length-1].concatEdge(firstEdge);
        }

        // if only a single edge, double-up on the first point
        if (e.length === 1)
        {
            e[0].addVertex(e[0].first.copy());
        }

        return e;
    }

    _walkUntil(start, distToWalk, direction, data)
    {
        // console.log(`walking ${distToWalk} units in ${direction}`);
        let toNext = vec2.create();
        
        let totalDist = 0;
        let dist = 0;

        let currIndex = start;
        let nextIndex = (direction > 0) ? this.nextIndex(start) : this.prevIndex(start);

        let currPoint = this.pointAt(currIndex);
        let nextPoint = this.pointAt(nextIndex);

        while (totalDist < distToWalk)
        {
            vec2.sub(toNext, currPoint, nextPoint);
            dist = vec2.length(toNext);

            this._pointData[currIndex] = data;
            
            if (totalDist + dist > distToWalk)
            {
                // insert new point
                let u = (distToWalk - totalDist) / dist;

                let newPoint = vec2.create();
                newPoint[0] = (currPoint[0] * (1-u)) + (nextPoint[0] * (u));
                newPoint[1] = (currPoint[1] * (1-u)) + (nextPoint[1] * (u));

                let insertAt = (direction < 0) ? currIndex : nextIndex;

                this._points.splice(insertAt, 0, newPoint);
                this._uvals.splice(insertAt, 0, 0);
                this._normals.splice(insertAt, 0, vec2.create());
                this._pointData.splice(insertAt, 0, data);
            }

            // advance
            currIndex = nextIndex;
            nextIndex = nextIndex = (direction > 0) ? this.nextIndex(currIndex) : this.prevIndex(currIndex);

            currPoint = nextPoint;
            nextPoint = this.pointAt(nextIndex);

            totalDist += dist;
        } 
    }

    addPointAtIntersection(l) 
    {
        // console.log(this.numPoints, this.points);
        let currSign;
        let prevSign = sign(l.getSideForPoint(this.prevPoint(0)));

        let currEdge = new Line2d(this.prevPoint(0), this.pointAt(0));
        for (let i=0; i < this.numPoints; i++)
        {
            currSign = sign(l.getSideForPoint(this._points[i]));
            
            if (currSign !== prevSign)
            {
                // currEdge = new Line2d(this.prevPoint(i), this.pointAt(i));
                currEdge = new Line2d(this.pointAt(i), this.nextPoint(i));
                let intersectionPoint = currEdge.intersect(l);

                if (intersectionPoint !== null)
                {
                    console.log('intersection! ', intersectionPoint);

                    if (vec2.equals(intersectionPoint, this.nextPoint(i)))
                    {
                        return this.prevIndex(i);
                    }

                    if (vec2.equals(intersectionPoint, this.pointAt(i)))
                    {
                        return i;
                    }

                    let insertAt = i;

                    this._points.splice(insertAt, 0, intersectionPoint);
                    this._uvals.splice(insertAt, 0, 0);
                    this._normals.splice(insertAt, 0, vec2.create());
                    this._pointData.splice(insertAt, 0, 0);
                    
                    this._vertices.splice(insertAt, 0,
                        new Vertex2d(intersectionPoint[0], intersectionPoint[1]));
                    
                    return insertAt;
                }
            }
            prevSign = currSign;
        }
        return -1;
    }

    intersectLine(l)
    {
        let currSign;
        let prevSign = sign(l.getSideForPoint(this.prevPoint(0)));

        let currEdge = new Line2d(this.prevPoint(0), this.pointAt(0));
        for (let i=0; i < this.numPoints; i++)
        {
            currSign = sign(l.getSideForPoint(this._points[i]));
            if (currSign !== prevSign)
            {
                currEdge = new Line2d(this.prevPoint(i), this.pointAt(i));
                let intersectionPoint = currEdge.intersect(cutLine);

                if (intersectionPoint !== null)
                {
                    return intersectionPoint;
                }
            }

            prevSign = currSign;
        }
        return null;        
    }

    /**
     * Cuts the polygon with the given line and returns two new polygons
     * @param {Line} l the line to cut 
     */
    cut(l)
    {
        let leftPoly = new Polygon();
        let rightPoly = new Polygon();

        let currSign;
        let prevSign = sign(l.getSideForPoint(this.prevPoint(0)));
        let leftSign = prevSign;
        
        let currEdge = new Line2d(this.prevPoint(0), this.pointAt(0));

        for (let i=0; i < this.numPoints; i++)
        {   
            // toLeft = l.isToLeft(this._points[i]);
            
            currSign = sign(l.getSideForPoint(this._points[i]));

            if (currSign !== prevSign)
            {
                currEdge = new Line2d(this.prevPoint(i), this.pointAt(i));
                
                let intersectionPoint = currEdge.intersect(l);

                if (intersectionPoint !== null)
                {
                    leftPoly.addPoint(intersectionPoint);
                    rightPoly.addPoint(intersectionPoint);
                }
                
            }

            if (currSign === leftSign)
            {
                leftPoly.addPoint(this._points[i]);
            }
            else
            {
                rightPoly.addPoint(this._points[i]);
            }

            // prevToLeft = toLeft;
            prevSign = currSign;
        }

        leftPoly._refresh();
        rightPoly._refresh();

        return [leftPoly, rightPoly];
    }
}