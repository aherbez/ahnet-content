function determintate2x2(a, b, c, d)
{
    return ((a * d) - (b * c));
}

function sign(v)
{
    if (v < 0) return -1;
    if (v > 0) return 1;
    return 0;
}

// 2-dimensional vector cross product v × w to be vx wy − vy wx.
function cross2d(v, w)
{
    return (v[0] * w[1]) - (v[1] * w[0]);
}

class Line2d
{
    constructor(s, e)
    {
        this._start = s || vec2.create();
        this._end = e || vec2.create();
    }

    set start(s)
    {
        this._start = s;
    }

    set end(e)
    {
        this._end = e;
    }

    get start() { return this._start; }
    get end() { return this._end; }

    get length()
    {
        return vec2.distance(this._start, this._end);
    }

    get diff()
    {
        return vec2.fromValues(
            this.end[0] - this.start[0],
            this.end[1] - this.start[1]
        );
    }

    /*
    isToLeft(p)
    {
        return (p[0] < this.start[0]);
    }
    */

    getSideForPoint(p)
    {
        // 𝑑=(𝑥−𝑥1)(𝑦2−𝑦1) − (𝑦−𝑦1)(𝑥2−𝑥1)
        let d = (((p[0] - this._start[0]) * (this.end[1] - this.start[1])) -
            ((p[1] - this.start[1]) * (this.end[0] - this.start[0])));
        return d;
    }

    /**
     * Get the point at which this line intersects another (if it exists)
     * @param {Line} l 
     */
    intersect(l)
    {
        let p = this.start;
        let r = this.diff;

        let q = l.start;
        let s = l.diff;

        // intersection: p + t r = q + u s

        // u = (q − p) × r / (r × s)
        let denominator = cross2d(r, s);

        if (denominator != 0)
        {
            let num = vec2.fromValues(
                q[0] - p[0],
                q[1] - p[1]
            );

            num = cross2d(num, r);

            let u = num / denominator;

            if (u < 0 || u > 1) return null;

            let intersection = vec2.fromValues(
                q[0] + (u * s[0]),
                q[1] + (u * s[1])
            );

            return intersection;
        }


        return null;
    }

}