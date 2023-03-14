/*
input: 



*/

class GridUnit
{
    constructor( x, y )
    {
        this.x = x;
        this.y = y;
        this.cost = Infinity;
    }
}

class Astar
{
    constructor()
    {
        this.map = [];

        this.path = [];

        this.distanceHuerestic = this._defaultDistanceHeuristic;
    }

    _sortByCost( a, b )
    {
        return (a.cost - b.cost);
    }

    // Manhattan distance
    _defaultDistanceHeuristic(a, b)
    {
        return ( Math.abs( a.x - b.x ) + Math.abs( a.y + b.y ) );
    }

    findPath(start, goal)
    {

    }
}