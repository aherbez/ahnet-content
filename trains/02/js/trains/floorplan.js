class FloorPlan extends node3d
{
    constructor(polygon, seed)
    {
        this.gl = gl;

        this.rand = new LGCRandom();

        if (!isNaN(seedVal))
        {
            this.rand.seed = seedVal;
        }

        this._basePoly = polygon;
    }

    /*
    addDoor (at, doorWidth)

    - addFeature(at, doorWidth, door)

    */


    /*
    addWindow (at, windowWidth)
    
    addFeature(at, windowWidth, window)    
    */

    /*
    addFeature (at, featureWidth, featureType)

    - find point Pd along outer walls to place feature
    - create two new points, Pd'1 and Pd'2 by moving forward and backwards from Pd by featureWidth/2
    - annotate new points as featureType_start / featureType_end

    */

    addFeature(at, featureWidth, featureType)
    {
        
    }



}