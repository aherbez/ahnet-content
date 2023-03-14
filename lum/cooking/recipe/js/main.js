let output;
let input;
let r;

function main()
{
    output = document.getElementById( 'output' );
    input = document.getElementById( 'difficulty' );

    // foo();
    /*
    let s = new Step();
    s.init( putOnionInPot );
    s.print(items);

    let p = new Process();
    p.init( mainProcess );
    p.print( items );
    */
    
    r = new Recipe();
    r.init( gumbo );
    // r.print( items );

    document.getElementById( 'btn' ).onclick = getRecipe;
    
    getRecipe();

}

function getRecipe()
{

    let rating = parseInt( input.value );
    rating = Math.min(Math.max( rating, 0 ), 100);

    console.log( rating );


    let path = r.generateSteps( rating );

    let s = path.getString( items );
    console.log( s );
    output.innerHTML = s;

}

main();