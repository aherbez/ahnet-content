class Inventory extends Entity
{
    constructor()
    {
        super();

        this.backImg = new Image();
        this.backImg.src = "img/inventory.png";

        this.width = 4 * 45 + 30;
        this.height = 3 * 45 + 80;

        this.selectedItemIndex = -1;

        this.lineDashOffset = 0;

        this.selectCallback = null;

        this.items = [];
    }

    setItems( storyItems )
    {
        this.items = storyItems.slice();
        
        let x, y;
        this.items.forEach( ( item, i ) =>
        {
            x = i % 4;
            y = Math.floor( i / 4 );
            
            this.items[ i ].setPos( x * 45 + 15, y * 45 + 40 );
            this.addChild( this.items[ i ] );

            // console.log( i, item.name );

        } );
    
    }

    clearSelection()
    {
        this.selectedItemIndex = -1;
    }

    _drawSelectionBox(ctx)
    {
        ctx.strokeStyle = 'rgb(255, 0, 0)';
        ctx.lineWidth = 4;

        let dash1 = 10 - this.lineDashOffset;
        let dash2 = this.lineDashOffset;

        let dashes = [ dash2, 10, dash1, 0 ];
        dashes = [ 0, 10, 10, 0 ];
        ctx.setLineDash( dashes );

        let x = this.selectedItemIndex % 4;
        let y = Math.floor( this.selectedItemIndex / 4 );

        ctx.strokeRect(x * 45 + 15 - 2.5, y * 45 + 40 - 2.5, 45, 45);
    }

    update( dt )
    {
        this.lineDashOffset += (dt / 1000.0 * 1);
        if( this.lineDashOffset > 10 ) this.lineDashOffset -= 10;
    }

    render( ctx )
    {
        ctx.drawImage( this.backImg, 0, 0 );

        if( this.selectedItemIndex !== -1 )
        {
            this._drawSelectionBox(ctx);
        }
    }

    mouseDown( p )
    {
        let gridX = Math.floor( ( p.x - 15 ) / 45 );
        let gridY = Math.floor( ( p.y - 40 ) / 45 );

        let index = gridY * 4 + gridX;
        
        if( index < this.items.length )
        {
            this.selectedItemIndex = index;
            // console.log( `clicked on ${this.items[ index ].name}` );

            if( this.selectCallback !== null )
            {
                this.selectCallback( this.items[ this.selectedItemIndex ] );
            }
        }
    }
}