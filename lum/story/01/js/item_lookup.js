class ItemImage
{
    constructor( src, gridSize )
    {
        this.image = new Image();
        this.image.src = src;

        this.gridSize = gridSize;
    }
}

class StoryItem extends Entity
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
        this.inventoryItem = false;
        this.levelItem = false;
        this.isLiving = false;

        this.danceSteps = 4;
        this._currStep = 0;

        this.offsetPos = new Point( 0, 0 );

    }

    set imageRef( img )
    {
        this._imageRef = img;
        this.gridSize = img.gridSize;
    }

    render( ctx )
    {
        if( this._imageRef != null)
        {
            ctx.save();
            ctx.translate(this.offsetPos.x, this.offsetPos.y);
            ctx.drawImage( this._imageRef.image, (this.offsetX * this.gridSize), (this.offsetY * this.gridSize), this.gridSize, this.gridSize,
                    0, 0, this.gridSize, this.gridSize );
            
            ctx.restore();
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
}

class ItemList 
{
    constructor(data)
    {
        this.sourceImages = {};

        this.inventoryItems = [];
        this.levelItems = [];
        this.livingItems = [];
        this.items = [];
        this.itemLookup = {};

        this.nextItem = 0;
        this.nextLiving = 0;
        this.nextInventory = 0;
        this.nextLevelItem = 0;

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
                newItem.inventoryItem = (item.inv === true);
                newItem.levelItem = (item.lvl === true);
                newItem.isLiving = ( item.living === true );
                newItem.id = ( this.items.length + 1 ) + '';


                this.items.push( newItem.id );
                this.itemLookup[ newItem.id ] = newItem;


                if( newItem.isLiving )
                {
                    this.livingItems.push( newItem.id );
                }
                else
                {
                    if( newItem.inventoryItem )
                    {
                        this.inventoryItems.push( newItem.id );
                    } else if( newItem.levelItem )
                    {
                        this.levelItems.push( newItem.id );
                    }
                    
                }
            
            } );
        }
        this.resetItemLists();
    }

    _getRandomItemFromList(list)
    {
        let index = Math.floor( Math.random() * list.length );
        index = list[ index ];
        return this.itemLookup[ index ];
    }

    resetItemLists()
    {
        this._shuffleArray( this.items );
        this._shuffleArray( this.levelItems );
        this._shuffleArray( this.livingItems );
        this._shuffleArray( this.inventoryItems );

        this.nextInventory = this.nextItem = this.nextLevelItem = this.nextLiving = 0;
    }

    getRandomItem()
    {
        if( this.nextItem >= this.items.length ) return null;

        let item = this.itemLookup[ this.items[ this.nextItem ] ];
        this.nextItem++;
        return item;
    }

    getRandomInventoryItem()
    {
        if( this.nextInventory >= this.inventoryItems.length ) return null;
        let item = this.itemLookup[ this.inventoryItems[ this.nextInventory ] ];
        this.nextInventory++;
        return item;
    }

    getRandomCharacter()
    {
        if( this.nextLiving >= this.livingItems.length ) return null;
        let item = this.itemLookup[ this.livingItems[ this.nextLiving ] ];
        this.nextLiving++;
        return item;    
    }

    getRandomLevelItem()
    {
        let item = this.itemLookup[ this.levelItems[ this.nextLevelItem ] ];
        this.nextLevelItem++;
        if( this.nextLevelItem >= this.levelItems.length )
        {
            this.nextLevelItem = 0;
        }
        return item;           
    }

    _shuffleArray(a)
    {
        for( let i = a.length - 1; i > 0; i-- )
        {
            let j = Math.floor( Math.random() * ( i + 1 ) );
            let x = a[ j ];
            a[ j ] = a[ i ];
            a[ i ] = x;
        }        
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