/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle( a )
{
    var j, x, i;
    for( i = a.length - 1; i > 0; i-- )
    {
        j = Math.floor( Math.random() * ( i + 1 ) );
        x = a[ i ];
        a[ i ] = a[ j ];
        a[ j ] = x;
    }
    return a;
}


/**
 * 
 * A single step, representing either:
 * - the combination of two items, or
 * - a "gathering step" (where one of the items is a gathering tool, such as a pot)
 */
class Step 
{
    static get STEP_NORMAL() { return 0; }
    static get STEP_GATHER() { return 1; }

    static get PHASE_PREP() { return 0;}
    static get PHASE_COOK() { return 1;}
    static get PHASE_PLATE() { return 2;}

    constructor()
    {
        this.items = [];
        this.phase = Step.PHASE_COOK;
        this.type = Step.STEP_NORMAL;

        this.gathering_tool = null;
    }

    init( data )
    {
        this.items = data.items.slice( 0 );
        if( data.type && data.type !== 0 )
        {
            this.type = Step.STEP_GATHER;

            switch (data.phase)
            {
                case 1:
                    this.phase = Step.PHASE_PREP;
                    break;
                case 2:
                    this.phase = Step.PHASE_COOK;
                    break;
                case 3:
                    this.phase = Step.PHASE_PLATE;
                    break;
                default:
                    break;
            }

            this.gathering_tool = data.gathering_tool || -1;
        }
    }

    getString( itemLookup )
    {
        // let s = this.hash + ': ';
        let s = '- ';
        if( this.isGatherStep() )
        {
            let itemIndex = (this.items[ 0 ] != this.gathering_tool) ? 0 : 1;
            s += "put " + items[ this.items[itemIndex] ] + " in " + items[ this.gathering_tool ];
            return s;
        }
        else
        {
            let parts = this.items.slice( 0 );
            s += "combine " + parts.map( ( i ) =>
            {
                return items[ i ];
            } ).join( " and " );
            // s = "combine " + s;
            return s;
        }
    }

    isGatherStep()
    {
        return this.type !== 0;
    }
    
    get hash()
    {
        if( this.isGatherStep() )
        {
            return "g_" + this.gathering_tool;    
        }

        return this.items.sort( ( a, b ) =>
        {
            return a - b;
        }).join( "_" );
    }
}

class Process
{
    constructor()
    {
        this.steps = [];
        this.main = false;
    }

    init( data )
    {
        if( data.main && data.main == 1 )
        {
            this.main = true;
        }
        data.steps.forEach( ( stepData ) =>
        {
            let st = new Step();
            st.init( stepData );

            this.steps.push( st );
        } );
    }

    getString( itemLookup )
    {
        let strings = [];
        this.steps.forEach( ( step ) =>
        {
            strings.push(step.getString( itemLookup ));
        } );

        return strings.join( '\n<br />' );
    }

    breakByGatherSteps()
    {
        let sequences = [];

        let currSeq = [];
        let stepHash;
        this.steps.forEach( ( s, i ) =>
        {
            currSeq.push( s );
            if( s.isGatherStep() )
            {
                sequences.push( {
                    steps: currSeq.slice( 0 ),
                    key: s.hash
                });
                currSeq = [];
            }
        } );
        return sequences;
    }

    get lastStep()
    {
        return this.steps[ this.steps.length - 1 ].hash;
    }
}

class RecipePath
{
    constructor()
    {
        this.steps = [];
    }

    addStep( step )
    {
        this.steps.push( step );
    }

    getString( itemLookup )
    {
        let strings = [];
        this.steps.forEach( ( step ) =>
        {
            strings.push(step.getString( itemLookup ));
        } );
        return strings.join( '\n<br />' );
    }

    finalize()
    {
        this.steps.reverse();
    }
}

class Recipe
{
    constructor()
    {
        this.mainProcess = null;
        this.optionalProcesses = [];
    }

    init( data )
    {
        this.mainProcess = new Process();
        this.mainProcess.init( data.main );

        data.processes.forEach( ( processData ) =>
        {
            let p = new Process();
            p.init( processData );
            this.optionalProcesses.push( p );
        } );
    }

    print( itemLookup )
    {
        this.mainProcess.print( itemLookup );

        this.optionalProcesses.forEach( ( p ) =>
        {
            console.log( '-----------------------------' );
            console.log(p.getString( itemLookup ));
        } );
    }

    /**
     * Generates a specific sequence of steps for presentation to the player
     * @param {int} difficulty 1-100 value of how hard to make it (% of optional processes added in) 
     */
    generateSteps( difficulty )
    {
        this.optionalProcesses = shuffle( this.optionalProcesses );

        let numOptional = Math.floor( ( difficulty / 100.0 ) * this.optionalProcesses.length ) + 1;
        let selectedProcesses = this.optionalProcesses.slice(0, numOptional);

        let processPartList = {};
        selectedProcesses.forEach( ( p ) =>
        {
            let key = p.lastStep;
            if( !processPartList[ key ] )
            {
                processPartList[ key ] = [];
            }
            processPartList[ key ].push( p );
        } );

        let path = new RecipePath();

        // go from the back to the front, shuffling steps together
        if( this.mainProcess )
        {
            // console.log( this.mainProcess.breakByGatherSteps() );

            let recipeParts = this.mainProcess.breakByGatherSteps();
            recipeParts.reverse();
            
            recipeParts.forEach( ( part ) =>
            {
                let fullPartList = [ part.steps.slice(0) ];
                let key = part.key;
                if( processPartList[ key ] )
                {
                    processPartList[ key ].forEach( ( process ) =>
                    {
                        fullPartList.push( process.steps.slice(0) );
                    } );
                }

                while( fullPartList.length > 0 )
                {
                    let selectIndex = Math.floor( Math.random() * fullPartList.length );

                    let step = fullPartList[ selectIndex ].pop();
                    path.addStep( step );

                    fullPartList = fullPartList.filter( ( a ) =>
                    {
                        return a.length > 0;
                    })
                };

            } );

            path.finalize();
            return path;

        }
        return null;
    }
}

