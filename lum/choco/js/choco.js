class ChocoGame extends Game
{
    constructor(el)
    {
        super( el );
        
        this.candies = [];

        this.box = new CandyBox( this.width * 0.8, this.height * 0.5 );
        this.box.setPos( this.width * 0.1, 250 );
        this.addChild( this.box );

        this.candyData = [];

        this.setupCandies();

        this.text = new TextBox( this.width * 0.8, this.height * 0.3 );
        this.text.setInfo(this._candyFromIndex(this.targetCandy));
        this.text.setPos( this.width * 0.1, 10 );
        this.addChild( this.text );

        this.init();
    }

    _shuffleCandies()
    {
        for( let i = this.candyData.length - 1; i > 0; i-- )
        {
            let j = Math.floor( Math.random() * ( i + 1 ) );
            let x = this.candyData[ j ];
            this.candyData[ j ] = this.candyData[ i ];
            this.candyData[ i ] = x;
        }
    }

    _candyFromIndex( num )
    {
        /*
        num = (C*4) + (S*4) + (T * 4)
        */

        let topping = Math.floor( num / 16 );
        let chocolate = Math.floor( ( num - ( topping * 16 ) ) / 4 );
        let shape = num % 4;

        return {
            c: chocolate,
            s: shape,
            t: topping
        };
    }

    setupCandies()
    {
        for( let i = 0; i < 16 * 4; i++ )
        {
            this.candyData.push( i );    
        }
        this._shuffleCandies();
        this.candyData = this.candyData.slice( 0, 15 );

        this.targetCandy = this.candyData[ 0 ];
        this._shuffleCandies();

        let chocolate = 0;
        let shape = 0;
        let topping = 0;

        let x = 0;
        let y = 0;
        let d = null;

        for( let i = 0; i < this.candyData.length; i++ )
        {
            x = ( i % 5 ) * 100 + 150;
            y = Math.floor( i / 5 ) * 100 + 350;
            d = this._candyFromIndex( this.candyData[ i ] );
            let c = new Candy( d.c, d.s, d.t );
            c.setPos( x, y );
            this.addChild( c ); 
        }

    }

    _render( ctx )
    {
        super._render( ctx );

        this.box.renderFront( ctx );
    }

    mouseDown( pos )
    {
        console.log( pos );

        let xGrid = pos.x - this.box.pos.x;
        let yGrid = pos.y - this.box.pos.y - 50;

        xGrid = Math.floor( xGrid / 100 );
        yGrid = Math.floor( yGrid / 100 );

        console.log( xGrid, yGrid );

        if( xGrid < 0 || xGrid > 4 ) return;
        if( yGrid < 0 || yGrid > 2 ) return;

        this.selectChocolate( xGrid, yGrid );
    }

    selectChocolate( x, y )
    {
        let selectedCandy = this.candyData[ ( y * 5 ) + x ];

        alert( selectedCandy == this.targetCandy );
    }

    render( ctx )
    {
        ctx.fillStyle = 'rgb(142, 81, 90)';
        ctx.fillRect( 0, 0, this.width, this.height );

        ctx.fillStyle = 'rgb(250, 220, 225)';
        ctx.fillRect( 0, this.height * 0.6, this.width, this.height * 0.4 );
    }

    update( dt )
    {
    }
}