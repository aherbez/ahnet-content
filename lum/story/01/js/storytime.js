/*
TODO
- pathfinding
- add stairs to room
- add extra statements in between things
- make textArea respect newlines (?)


DONE
- choose starting position for player
- hide/show story
- register combinations of things
- track progress through story
*/


class Storytime extends Game
{
    constructor(el)
    {
        super( el );

        this.level = new Room( 8, 7, 24 );
        this.level.scale.x = 2;
        this.level.scale.y = 2;
        this.level.selectCallback = this.itemSelected.bind( this );
        this.level.setPos( 350, 50 );

        this.addChild( this.level );

        this.scroll = new Scroll();
        this.scroll.setPos( 40, 200 );
        this.addChild( this.scroll );
        
        this.inventory = new Inventory();
        this.inventory.selectCallback = this.inventorySelected.bind( this );
        this.inventory.setPos( 40, 40 );        
        this.addChild( this.inventory );
        
        this.items = new ItemList( itemData );

        this.story = new Storyteller( stepTemplates, this.items, extraStatements );
        this.story.genStory( 3 );
        this.scroll.setText( this.story.getText() );

        this.inventory.setItems( this.story.inventoryItems );
        this.level.addItems( this.story.levelItems );
        this.level.addItems( this.story.characters );

        this.selectedInInventory = null;
        this.selectedInLevel = null; 

        this.init();
    }

    itemSelected( item )
    {
        this.selectedInLevel = item;
        this.maybeAdvanceStory();
    }

    inventorySelected( item )
    {
        this.selectedInInventory = item;
        this.maybeAdvanceStory();
    }

    maybeAdvanceStory()
    {
        let selected = [];
        if( this.selectedInInventory !== null ) selected.push( this.selectedInInventory );
        if( this.selectedInLevel !== null ) selected.push( this.selectedInLevel );

        if( this.story.checkStep( selected ) )
        {
            console.log( 'CORRECT' );

            if( this.selectedInLevel !== null )
            {
                this.selectedInLevel.startDance();
            }

            if( this.selectedInInventory !== null )
            {
                this.selectedInInventory.startDance();
            }

            this.level.clearSelection();
            this.inventory.clearSelection();

            this.selectedInInventory = null;
            this.selectedInLevel = null;
        }
        else
        {
            console.log( 'NOT YET' );    
        }
    }

    mouseDown( p )
    {
        this.scroll.hideStory();
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