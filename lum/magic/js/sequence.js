const DRAW = 1;
const SAY = 2;

let Sequence = class 
{
    constructor( num ) 
    {
        this.actions = [];
        for( let i = 0; i < num; i++ )
        {
            this.addAction();    
        }
        console.log( this.actions );
    }

    addAction()
    {
        let action = {};
        action.type = Sequence.DRAW;
        // action.subtype = "circle";
        let index = Math.floor( Sequence.shapes.length * Math.random() );
        action.subtype = Sequence.shapes[ index ];
        
        this.actions.push( action );
    }
}

Sequence.DRAW = 1;
Sequence.SAY = 2;
Sequence.shapes = [
    'circle',
    'x',
    'rectangle',
    'v',
    'basin',
];