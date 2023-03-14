class LGCRandom
{
    constructor(seedVal)
    {
        this.a = 1664525;
        this.c = 1013904223;
        this.m = Math.pow(2,32);

        this._seed = seedVal;

        this._value = 0;

        this.init();
    }

    // resets the random generation
    init()
    {
        if (this._seed === undefined) 
        {
            // this.seed = parseInt(Date.now()) % this.m;
            let d = new Date();
            this.seed = d.getMilliseconds();
        }
        else
        {
            this.seed = this._seed;
        }
    }

    set seed(seedVal)
    {
        this._seed = seedVal;
        this._value = this._seed;
    }

    /**
     * return a random number 0-1
     */
    random()
    {
        this._value = ((this.a * this._value) + this.c) % this.m;
        return (this._value / this.m);
    }

    randInt(min, max)
    {
        let r = this.random();
        return Math.floor((max-min) * r) + min;
    }

    randInRange(min, max)
    {
        return this.random() * (max-min) + min;
    }

    randN(max)
    {
        return this.randInt(0, max);
    }

    testDistribution(num)
    {
        let count = [];
        let n;
        for (let i=0; i < num; i++)
        {
            n = this.randInt(0,10);
            if (count[n] != undefined)
            {
                count[n]++;
            }
            else
            {
                count[n] = 1;
            }
        }
        console.log(count);
    }
}