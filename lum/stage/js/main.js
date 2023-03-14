let game = null;

let level1 = [
    {
        name: 'actor',
        main: -1
    },
    {
        name: 'juggler',
        main: 0
    }
];

let level2 = [
    {
        name: 'singer',
        spots: [ 0, 0, 1, 1 ],
        main: -1
    },
    {
        name: 'juggler',
        spots: [ 1, 0, 0, 1 ],
        main: 0,
    },
    {
        name: 'brassband',
        spots: [ 1, 1, 1, 1 ],
        main: 0,
    },
];

let level3 = [
    {
        name: 'singer',
        spots: [ 0, 0, 1, 1 ],
        main: -1,
        fog: false
    },
    {
        name: 'magician',
        spots: [ 0, 0, 0, 0 ],
        main: 0,
        fog: true
    },
    {
        name: 'juggler',
        spots: [ 1, 1, 1, 1 ],
        main: -1,
        fog: true
    },
    {
        name: 'actor',
        spots: [ 0, 1, 0, 0 ],
        main: -1,
        fog: false
    }
];


function init()
{
    game = new StageHandGame( "stage" );

    document.getElementById( 'lvl1' ).addEventListener( 'mousedown', function()
    {
        game.initData( level1 );
    } );
    document.getElementById( 'lvl2' ).addEventListener( 'mousedown', function()
    {
        game.initData( level2 );
    } );
    document.getElementById( 'lvl3' ).addEventListener( 'mousedown', function()
    {
        game.initData( level3 );
    } );


    game.initData( level1);
}

init();