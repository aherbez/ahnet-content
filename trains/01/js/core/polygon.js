/**
 * 
 * A 2d polygon
 */

class Polygon
{
    constructor()
    {
        this._points = [];
        this._normals = [];
        this._uvals = [];

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

    addPoint(p)
    {
        this._points.push(p);
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

    copy()
    {
        let polygon = new Polygon();

        this._points.forEach(p => {
            polygon.addPoint(vec2.clone(p));
        });

        polygon._refresh();
        return polygon;
    }

    /**
     * Cuts the polygon with the given line and returns two new polygons
     * @param {Line} l the line to cut 
     */
    cut(l)
    {
        let leftPoly = new Polygon();
        let rightPoly = new Polygon();

        // let leftSide = l.getSideForPoint(this.points[0]);
        // let leftSign = sign(leftSide);

        let currSign;

        // let toLeft = l.isToLeft(this._points[0]);
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

        console.log(leftPoly.numPoints, rightPoly.numPoints);

        leftPoly._refresh();
        rightPoly._refresh();

        return [leftPoly, rightPoly];
    }
}