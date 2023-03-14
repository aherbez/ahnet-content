class ImageSet
{
    constructor(ctx)
    {
        this.images = {};
        this.width = -1;
        this.height = -1;

        this.ctx = ctx;
    }

    setContext( ctx )
    {
        this.ctx = ctx;
    }

    setBounds( width, height )
    {
        this.width = width;
        this.height = height;
    }

    loadImage( name, src, anchor)
    {
        let anchorPoint = [ 0, 0 ];
        if( Array.isArray( anchor ) )
        {
            if( anchor[ 0 ] && anchor[ 0 ] <= 1 && anchor[ 0 ] >= 0 ) anchorPoint[ 0 ] = anchor[ 0 ];
            if( anchor[ 1 ] && anchor[ 1 ] <= 1 && anchor[ 1 ] >= 0 ) anchorPoint[ 1 ] = anchor[ 1 ];
        }

        this.images[ name ] = {
            image: new Image(),
            loaded: false,
            anchor: anchorPoint,
        };
        this.images[ name ].image.src = src;
    }

    getWidth( name )
    {
        if( this.images.hasOwnProperty( name ) )
        {
            return this.images[ name ].image.width;
        }
        return -1;
    }

    get( name )
    {
        if( this.images.hasOwnProperty( name ) )
        {
            return this.images[ name ];    
        }
        console.log( "IMAGE NOT FOUND" );
        return null;
    }

    draw( name, x, y)
    {
        if( !this.ctx )
        {
            console.log( "NO CTX" );
            return;
        }
        let img = this.get( name );
        if( img )
        {
            let xPos = x + ( img.anchor[0] * -img.image.width );
            let yPos = y + ( img.anchor[ 1 ] * -img.image.height );

            this.ctx.drawImage( img.image, xPos, yPos );    
        }
    }
    
}