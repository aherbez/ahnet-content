class TextBox extends Entity
{
    constructor(width, height)
    {
        super();

        this.width = width;
        this.height = height;

        this.textLines = [];

        this.cLightPink = 'rgb(248, 214, 220)';
        this.cPinkText = 'rgb(208, 73, 91)';
        this.cDarkText = 'rgb(88, 24, 32)';

        this.leftHeart = new ImageEntity( 'img/heart.png', [ 0, 0 ] );
        this.leftHeart.setPos( 10, 10 );
        this.addChild( this.leftHeart );

        this.rightHeart = new ImageEntity( 'img/heart.png', [ 1, 0 ] );
        this.rightHeart.setPos( this.width - 10, 10 );
        this.addChild( this.rightHeart );

    }

    setInfo( data )
    {
        let shapes = ['circle','square','heart','rounded'];
        let chocolates = ['milk', 'dark', 'white', 'strawberry'];
        let toppings = [ 'no', 'sprinkles', 'swirl', 'squiggle' ];
        
        this.textLines = [];
        this.textLines.push( '- ' + chocolates[ data.c ] + ' chocolate' );
        this.textLines.push( '- ' + shapes[ data.s ] + ' shape');
        this.textLines.push( '- ' + toppings[ data.t ] + ' topping' );
        
    }

    render( ctx )
    {
        ctx.strokeStyle = 'rgb(102, 35, 44)';
        ctx.fillStyle = 'rgb(255, 253, 253)';
        ctx.lineWidth = 10;

        ctx.fillRect( 0, 0, this.width, this.height);
        
        ctx.fillStyle = this.cLightPink;
        ctx.fillRect( 0, 0, this.width, 50 );
        
        ctx.fillRect( 0, this.height - 50, this.width, 50 );
        ctx.strokeRect( 0, 0, this.width, this.height );
        
        ctx.font = '30px Arial';
        ctx.fillStyle = this.cPinkText;
        ctx.textAlign = 'center';

        ctx.fillText('Find The Special Chocolate!', this.width/2, 40);

        ctx.textAlign = 'right';
        ctx.fillText( '- secret admirer', this.width * 0.95, this.height * 0.90 );
    
        ctx.fillStyle = this.cDarkText;

        ctx.textAlign = 'left';
        ctx.fillText('It has', 100, 80);
        
        ctx.textAlign = 'right';
        for( let i = 0; i < this.textLines.length; i++ )
        {
            ctx.fillText( this.textLines[ i ], this.width * 0.9, 80 + ( i * 30 ) );
        }
    }
}