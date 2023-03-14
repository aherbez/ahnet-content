/*
TODO

DONE
- bold text
- add inventory items
- make objects appear / disappear

*/

class ReviewButton extends stEntity
{
    constructor()
    {
        super();
        this.imgSrc = new stImageEntity( 'img/sprites.png', [ 0, 0 ]);
    
        this.offsetX = 7;
        this.offsetY = 324;

        this.width = 189;
        this.height = 48;
    }

    render( ctx )
    {
        ctx.save();
        ctx.drawImage( this.imgSrc.image,
            this.offsetX, this.offsetY,
            this.width, this.height,
            0, 0,
            this.width, this.height );
        ctx.restore();        
    }
}

class ContinueButton extends stEntity
{
    constructor()
    {
        super();
        this.imgSrc = new stImageEntity( 'img/sprites.png', [ 0, 0 ] );

        this.offsetX = 7;
        this.offsetY = 324;

        this.width = 189;
        this.height = 48;
    }

    render( ctx )
    {
        ctx.save();
        ctx.drawImage( this.imgSrc.image,
            this.offsetX, this.offsetY,
            this.width, this.height,
            0, 0,
            this.width, this.height );
        ctx.restore();
    }
}

class Storytime extends stGame
{
    constructor(el)
    {
        super( el );

        this.scale.x = 1.5;
        this.scale.y = 1.5;

        this.storyBook = new StoryBook();
        this.addChild( this.storyBook );

        this.items = [];

        this.itemLookup = new ItemList(itemData);

        this.endScreen = new stImageEntity( 'img/result_screen.png', [ 0, 0 ] );
        this.addChild( this.endScreen );
        this.endScreen.setZIndex( 1000 );
        this.endScreen.active = false;

        this.player = this.itemLookup.getItem( '22' );
        this.player.setZIndex( 50 );
        this.player.setPos( this.width / 2, this.height / 2 );
        this.addChild( this.player );

        // this.storyBook.clickCallback = this.hideStory.bind( this );

        this.currentStep = 0;
        this.stepsData = null;

        this.selectedItem = null;
        this.selectedInventory = null;
        
        this.currSection = 0;
        this.startSection( this.currSection );
        
        this.showingInbetween = false;

        this.btnReview = new ReviewButton();
        this.btnReview.setPos( 20, 20 );
        this.btnReview.mouseDown = function(p)
        {
            this.storyBook.active = true;
        }.bind(this);
        this.addChild( this.btnReview );

        this.init();
    }

    clearItems()
    {
        this.items.forEach( ( item ) =>
        {
            this.removeChild( item );
        } );
        this.items = [];

        if( this.inventorySelected != null ) this.inventorySelected.selected = false;
        if( this.selectedItem != null ) this.selectedItem.selected = false;

        this.inventorySelected = null;
        this.selectedItem = null;
        this.numInventory = 0;
    }

    _setBackground( imgSrc )
    {
        if( this.backingImg != null )
        {
            this.removeChild( this.backingImg );
            this.backingImg = null;
        }

        this.backingImg = new stImageEntity( imgSrc, [ 0, 0 ] );
        this.backingImg.setZIndex( 0 );
        this.addChild( this.backingImg );
    }

    _addLevelItems( items )
    {
        items.forEach( ( item ) =>
        {
            let newItem = this.itemLookup.getItem( item[ 0 ] );
            newItem.setPos( item[ 1 ], item[ 2 ] );
            newItem.setZIndex( 5 );
            newItem.isInventory = false;
            newItem.selectCallback = this.itemSelected.bind( this );
            this.addChild( newItem );
            this.items.push( newItem );
        } );        
    }

    _addInventoryItems( items )
    {
        items.forEach( ( id, i ) =>
        {
            let newItem = this.itemLookup.getItem( id );
            newItem.selectCallback = this.itemSelected.bind( this );
            newItem.setPos( 200 + ( this.numInventory * 100 ), 434 );
            newItem.isInventory = true;
            this.addChild( newItem );
            this.items.push( newItem );
            this.numInventory++;
        } );        
    }

    startSection( sectionIndex )
    {
        this.clearItems();

        let data = story.sections[ sectionIndex ];

        this.storyBook.setPageText( data.text.left, data.text.right );
        this.storyBook.active = true;

        this._setBackground( data.background );

        this._addLevelItems( data.items );

        this._addInventoryItems( data.inventory );

        this.player.setZIndex( 50 );
        this.player.setPos( data.playerStart[ 0 ], data.playerStart[ 1 ] );
        this.storyBook.setZIndex(100);

        this.currentStep = 0;
        this.stepsData = data.steps;

    }

    hideStory()
    {
        if( this.storyBook.active )
        {   
            console.log( "hiding story" );
            this.storyBook.active = false;
        }
    }

    _getPointNearItem( item )
    {
        let targetPos = new Point( item.pos.x, item.pos.y );
        targetPos.x -= this.player.pos.x;
        targetPos.y -= this.player.pos.y;
        let dist = Math.sqrt( targetPos.sqDist() );
        let fraction = 50 / dist;

        targetPos.x *= ( 1 - fraction );
        targetPos.y *= ( 1 - fraction );

        let duration = targetPos.sqDist() / ( 800 * 800 ) * 10;
        
        targetPos.x += this.player.pos.x;
        targetPos.y += this.player.pos.y;

        return [targetPos, duration];
    }

    itemSelected( item )
    {
        console.log( `clicked on ${item.name}` );


        if( item.isInventory )
        {   
            if( this.selectedInventory != null )
            {
                this.selectedInventory.selected = false;
            }

            this.selectedInventory = item;
            this.maybeAdvanceStory();
        }
        else
        {
            if( this.selectedItem != null )
            {
                this.selectedItem.selected = false;
            }

            this.selectedItem = item;

            let newPos, duration;
            [ newPos, duration ] = this._getPointNearItem( item );
            if( duration > 0.1 )
            {
                this.player.tweenPos( newPos.x, newPos.y, duration, this.maybeAdvanceStory.bind( this ) );
            }
            else
            {
                this.maybeAdvanceStory();
            }
        }

        item.selected = true;
   }

    inventorySelected( item )
    {
        this.selectedInInventory = item;
        this.maybeAdvanceStory();
    }

    _getItemById( id )
    {
        let foundItem = null;
        let itemIndex = -1;
        this.items.forEach( ( item, i ) =>
        {
            if( item.id == ( id + '' ) )
            {
                foundItem = item;
                itemIndex = i;
            }
        } );
        
        return [ foundItem, itemIndex ];
    }

    _removeItem( id )
    {
        let toRemove = null;
        let toRemoveIndex = -1;
        this.items.forEach( ( item, i ) =>
        {
            if( item.id == (id + '') )
            {
                toRemove = item;
                toRemoveIndex = i;
            }
        } );

        if( toRemove )
        {
            this.removeChild( toRemove );
            this.items.splice( toRemoveIndex, 1 );

        }
    }

    _addItem( data, isInventory )
    {   
        let newId = data[ 0 ];
        let x = 0;
        let y = 0;

        if( isInventory )
        {
            x = 200 + (this.numInventory * 100);
            y = 434;
            this.numInventory++;
        }
        else
        {
            x = data[ 1 ];
            y = data[ 2 ];
        }

        let newItem = this.itemLookup.getItem( newId );
        newItem.setPos( x, y );
        newItem.selectCallback = this.itemSelected.bind( this );
        newItem.isInventory = isInventory;
        this.addChild( newItem );
        this.items.push( newItem );
    }

    _changeScene( data )
    {
        this.clearItems();
        this._setBackground( data[ 0 ] );
        this._addLevelItems( data[ 1 ] );
        this._addInventoryItems( data[ 2 ] );

        this.player.setPos( data[ 3 ][ 0 ], data[ 3 ][ 1 ] );
    }

    _replaceItem( oldID, newID )
    {
        console.log( `replacing ${oldID} with ${newID}` );
        let toReplace = null;

        console.log( this.items.length + ' ITEMS' );
        this.items.forEach( ( item, i ) =>
        {
            if( item.id == ( oldID + '' ) )
            {
                toReplace = item;
            }
        } );
        
        if( toReplace )
        {
            let [ x, y ] = [toReplace.pos.x, toReplace.pos.y];
            let newItem = this.itemLookup.getItem( newID );
            Object.assign( toReplace, newItem );           
            toReplace.setPos( x, y );
        }

    }

    _moveAction( data )
    {
        let [ item, itemIndex ] = this._getItemById( data[ 0 ] );
        let [ x, y ] = [ data[ 1 ], data[ 2 ] ];
        let action = data[ 3 ] || null;

        if( item != null )
        {
            item.tweenPos( x, y, 0.4, this.processAction( action ) );
        }
    }

    processAction( action )
    {
        if( !action ) return;

        switch( action.type )
        {
            case "remove":
                this._removeItem( action.data[ 0 ] );
                break;
            case "add":
                this._addItem( action.data, false );
                break;
            case "add_inv":
                this._addItem( action.data, true );
                break;
            case "move":
                break;
            case "replace":
                this._replaceItem( action.data[ 0 ], action.data[ 1 ] );
                break;
            case "animate":
                this._moveAction(action.data);
                break;
            case "change_scene":
                this._changeScene( action.data );
                break;
            default:
                break;
        }
    }

    clearSelection()
    {
        if( this.selectedInventory != null )
        {
            this.selectedInventory.selected = false;
        }
        this.selectedInventory = null;

        if( this.selectedItem != null )
        {
            this.selectedItem.selected = false;
        }

        this.selectedItem = null;
    }

    maybeAdvanceStory()
    {
        let currStep = this.stepsData[ this.currentStep ];

        let totalSelected = [];
        if ( this.selectedInventory != null ) totalSelected.push( this.selectedInventory.id );
        if ( this.selectedItem != null ) totalSelected.push( this.selectedItem.id );

        let completed = true;
        currStep.items.forEach( ( id ) =>
        {
            if( totalSelected.indexOf( id+'' ) == -1 )
            {
                completed = false;
            }
        } );

        if ( completed )
        {
            this.clearSelection();

            // this.selectedInventory = null;
            // this.selectedItem = null;

            currStep.result.forEach( ( action ) =>
            {
                this.processAction( action );
            } );
            
            this.currentStep++;
            
            if( this.currentStep >= this.stepsData.length )
            {
                this.currentStep = 0;
                this.moveToNextScene();
            }
        }
    }

    moveToNextScene()
    {
        this.currSection++;
        this.endScreen.active = true;
        this.showingInbetween = true;
    }

    mouseDown( p )
    {

        if ( this.showingInbetween )
        {
            this.startSection( this.currSection );
            this.endScreen.active = false;
            this.showingInbetween = false;
            this.storyBook.active = true;
        }
        else if (this.storyBook.active)
        {
            this.storyBook.active = false;
        }
        
    }

    update( dt )
    {

    }

    render( ctx )
    {
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect( 0, 0, this.width, this.height );

    }
}