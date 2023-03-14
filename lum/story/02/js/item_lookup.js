class ItemImage
{
    constructor( src, gridSize )
    {
        this.image = new Image();
        this.image.src = src;

        this.gridSize = gridSize;
    }
}

class StoryItem extends stEntity
{
    constructor()
    {
        super();

        this._imageRef = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.gridSize = 1;
        this.id = -1;

        this.name = '';

        this.danceSteps = 4;
        this._currStep = 0;

        this.offsetPos = new Point( 0, 0 );

        this.selected = false;

    }

    set imageRef( img )
    {
        this._imageRef = img;
        this.gridSize = img.gridSize;
        this.halfGrid = this.gridSize / 2;
    }

    drawSelection( ctx )
    {
        ctx.save();
        ctx.strokeStyle = 'rgb(128,128,128)';
        ctx.fillStyle = 'rgba(255, 255, 255, 100)';
        ctx.lineWidth = 4;
        ctx.beginPath();

        ctx.arc( 0, 0, this.gridSize * 0.4, 0, Math.PI * 2 );

        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    render( ctx )
    {
        if( this.selected )
        {
            this.drawSelection( ctx );    
        }


        if( this._imageRef != null)
        {
            ctx.save();
            ctx.translate(this.offsetPos.x, this.offsetPos.y);
            ctx.drawImage( this._imageRef.image,
                ( this.offsetX * this.gridSize ), ( this.offsetY * this.gridSize ),
                this.gridSize, this.gridSize,
                -this.gridSize/2, -this.gridSize/2,
                this.gridSize, this.gridSize );
            ctx.restore();
        }
    }

    pointInside( p )
    {
        if( p.x < (-this.halfGrid) ) return false;
        if( p.y < (-this.halfGrid) ) return false;
        if( p.x > this.halfGrid ) return false;
        if( p.y > this.halfGrid ) return false;
        return true;
    }

    mouseDown( p )
    {
        //console.log( `clicked on ${this.name}` );
        if( this.selectCallback )
        {
            this.selectCallback( this );
        }
    }

    setXOffset(amt)
    {
        // this.offsetPos.x = amt;
        this._tweens.push( new stTween( this.offsetPos.x, amt, {
            duration: 0.1,
            update: function( v )
            {
                this.offsetPos.x = v;
            }.bind( this ),
        } ) );          
    }

    startDance()
    {
        this._currStep = 0;
        this.dance();
    }

    dance()
    {
        if( this._currStep >= this.danceSteps ) return;

        let newY = ( this._currStep % 2 == 0 ) ? -10 : 0;
        this._tweens.push( new stTween( this.offsetPos.y, newY, {
            duration: 0.1,
            update: function( v )
            {
                this.offsetPos.y = v;
            }.bind( this ),
            callback: function() { this._currStep++; this.dance(); }.bind( this )
        } ) );        
    }

    setItem( itemData )
    {
        Object.assign( this, itemData );
    }
}

class ItemList 
{
    constructor(data)
    {
        this.sourceImages = {};

        this.items = [];
        this.itemLookup = {};

        if( data.hasOwnProperty( 'images' ) )
        {
            data[ 'images' ].forEach( ( img, i ) =>
            {
                let id = (img.id + '');
                let sourceImg = new ItemImage( img.src, img.size );
                this.sourceImages[ id ] = sourceImg;
            } );    
        }

        if( data.hasOwnProperty( 'items' ) )
        {
            data[ 'items' ].forEach( ( item, i ) =>
            {
                let newItem = new StoryItem();
                newItem.imageRef = this.sourceImages[ item.src+'' ];
                newItem.name = item.name;
                newItem.offsetX = item.x;
                newItem.offsetY = item.y;
                newItem.isInventory = ( item.inv && item.inv === true ) ? true : false;
                newItem.id = item.id + '';

                this.items.push( newItem.id );
                this.itemLookup[ newItem.id ] = newItem;
            
            } );
        }
    }

    getItem( id )
    {
        // return this.itemLookup[ id ].copy();
        return Object.assign( new StoryItem(), this.itemLookup[ id ] );
    }

    _getRandomItemFromList(list)
    {
        let index = Math.floor( Math.random() * list.length );
        index = list[ index ];
        return this.itemLookup[ index ];
    }

    getItems( list )
    {
        let items = [];
        list.forEach( ( index ) =>
        {
            items.push( this.itemLookup[ index ] );
        } );
        return items;
    }

    getRandomItems( n )
    {
        this._shuffleArray(this.items);
        let itemIDs = this.items.slice( 0, n );
        
        return ( this.getItems( itemIDs ) );
    }
    
}