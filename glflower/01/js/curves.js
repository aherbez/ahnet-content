class Point
{
    constructor(x, y, z)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    interpolateTo(target, u)
    {
        let p = new Point();
        p.x = (this.x * (1-u)) + (target.x * u);
        p.y = (this.y * (1-u)) + (target.y * u);
        return p;
    }
}

class bzCurveQuad
{
    constructor(p1, p2, p3)
    {
        this.points = [];
        this.points[0] = p1 || new Point();
        this.points[1] = p2 || new Point();
        this.points[2] = p3 || new Point();
    }

    get start()
    {
        return this.points[0];
    }

    get end()
    {
        return this.points[2];
    }

    getPointAt(u)
    {
        if (u < 0 || u > 1) {
            console.error(`u of ${u} not in range 0-1`);
            return null;
        }
    
        let p = new Point();
        p.x = Math.pow(1-u, 2) * this.points[0].x +
            (1-u) * 2 * u * this.points[1].x +
            u * u * this.points[2].x;
    
        p.y = Math.pow(1-u, 2) * this.points[0].y +
            (1-u) * 2 * u * this.points[1].y +
            u * u * this.points[2].y;
        return p;
    }
}

class bzCurveCubic
{
    constructor(p1, p2, p3, p4)
    {
        this.points = [];
        this.points[0] = p1 || new Point();
        this.points[1] = p2 || new Point();
        this.points[2] = p3 || new Point();
        this.points[3] = p4 || new Point();
    }

    get start()
    {
        return this.points[0];
    }

    get end()
    {
        return this.points[3];
    }

    getPointAt(u)
    {
        if (u < 0 || u > 1) {
            console.error(`u of ${u} not in range 0-1`);
            return null;
        }

        let p = new Point();
        p.x = Math.pow(1-u, 3) * this.points[0].x +
            Math.pow(1 - u, 2) * 3 * u * this.points[1].x + 
            (1-u) * 3 * u * u * this.points[2].x +
            u * u * u * this.points[3].x;
        p.y = Math.pow(1-u, 3) * this.points[0].y +
            Math.pow(1 - u, 2) * 3 * u * this.points[1].y + 
            (1-u) * 3 * u * u * this.points[2].y +
            u * u * u * this.points[3].y;
        return p;
    }
}