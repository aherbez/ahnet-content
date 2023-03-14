// import { Player} from './player'

class Room extends stEntity
{
    constructor( gridX, gridY, gridSize )
    {
        super();

        this.selectCallback = null;

        this.numW = gridX;
        this.numH = gridY;
        this.gridSize = gridSize;

        this.width = ( gridX + 2 ) * gridSize;
        this.height = ( gridY + 4 ) * gridSize;
        
        this.initTiles();
    
        this.tileData = [];
        for( let i = 0; i < this.numH; i++ )
        {
            this.tileData[ i ] = [];
            for( let j = 0; j < this.numW; j++ )
            {
                this.tileData[ i ][ j ] = 0;
            }
        }
        
        this.waterTiles = [
            'water2', // 0
            'water8', // 1
            'water3', // 2
            'water9', // 3
            'water12', // 4
            'water5', // 5
            'water13', // 6
            'water6', // 7
            'water1', // 8
            'water7', // 9
            'water19', // 10
            'bricks1', // 11
            'water11', // 12
            'water4', // 13
            'bricks1', // 14
            'water10', // 15
        ];

        this.floorTiles = [
            'floor1',
            'floor2',
            'floor3',
            'floor4',
            'floor5',
            'floor6'
        ];
        
        this.tileRandomization = [];
        for( let i = 0; i < this.numW * this.numH; i++ )
        {
            this.tileRandomization[ i ] = ( Math.floor( Math.random() * 100 ) );
        }

        this.itemLocations = [];
        let tileIndex;
        for( let i = 0; i < ( this.numH - 2 ); i++ )
        {
            for( let j = 0; j < ( this.numW - 2 ); j++ )
            {
                tileIndex = ( ( i + 1 ) * this.numW ) + ( j + 1 );
                this.itemLocations.push( tileIndex );
            }
        }
        st.shuffleArray( this.itemLocations );
        this.nextItemLocation = 0;

        this.items = [];

        this.itemLookup = {};

        this.player = new Player();
        this.player.scale.x = this.player.scale.y = 0.5;
        this.player.setZIndex( 0 );
        this.addChild( this.player );

        // place player
        let x, y;
        x = ( this.itemLocations[ this.nextItemLocation ] % this.numW ) + 1.1;
        y = ( Math.floor( this.itemLocations[ this.nextItemLocation ] / this.numW ) ) + 2.1;
        this.player.setPos( x * this.gridSize, y * this.gridSize );

        this.nextItemLocation++;


        this.selectedTileIndex = -1;
    }

    addItems( items )
    {
        let x, y, itemLoc;
        items.forEach( ( item, i ) =>
        {
            itemLoc = this.itemLocations[ this.nextItemLocation ];
            x = ( itemLoc % this.numW ) + 1.1;
            y = ( Math.floor( itemLoc / this.numW ) ) + 2.1;
            
            item.setPos( x * this.gridSize, y * this.gridSize );
            item.scale.x = item.scale.y = 0.5;
            this.addChild( item );
            this.items.push( item );

            this.itemLookup[ itemLoc ] = item;
            this.nextItemLocation++;
        } );
    }

    getTileOffset( x, y )
    {
        let topSame = ( y > 0 && this.tileData[ y ][ x ] == this.tileData[ y - 1 ][ x ] );
        let botSame = ( y < ( this.numH - 1 ) && this.tileData[ y ][ x ] == this.tileData[ y + 1 ][ x ] );
        let rightSame = ( x < ( this.numW - 1 ) && this.tileData[ y ][ x ] == this.tileData[ y ][ x + 1 ] );
        let leftSame = ( x > 0 && this.tileData[ y ][ x ] == this.tileData[ y ][ x - 1 ] );

        let total = ( topSame ) ? 0 : 1;
        total += ( rightSame ) ? 0 : 2;
        total += ( botSame ) ? 0 : 4;
        total += ( leftSame ) ? 0 : 8;

        return total;
    }

    getRandomizedIndex( odds )
    {
        let choice = Math.random();
        let total = 0;
        for( let i = 0; i < odds.length; i++ )
        {
            total += odds[ i ];
            if( total > choice )
            {
                return i;
            }
        }
        return ( odds.length - 1 );
    }

    getRandomTile( tiles, odds )
    {
        if( tiles.length != odds.length )
        {
            console.error( "MISMATCED LENGTHS" );
            return null;
        }
        return tiles[ this.getRandomizedIndex( odds ) ];
    }


    initTiles()
    {
        this.tileset = new Tileset( 'img/dungeontiles.png', this.gridSize, this.gridSize );
        
        for( let i = 0; i < 6; i++ )
        {
            this.tileset.setTile( 'floor' + ( i + 1 ), i, 0 );
        }

        for( let i = 0; i < 4; i++ )
        {
            this.tileset.setTile( 'mossy' + ( i + 1 ), i + 6, 0 );
        }

        for( let i = 0; i < 7; i++ )
        {
            this.tileset.setTile( 'bricks' + ( i + 1 ), i, 1 );
        }

        this.tileset.setTile( 'stairsDown', 7, 1 );
        this.tileset.setTile( 'stairsUp', 8, 1 );

        this.tileset.setTile( 'top0', 9, 1 );

        for( let i = 0; i < 10; i++ )
        {
            this.tileset.setTile( 'top' + ( i + 1 ), i, 2 );
            
            if( i < 4 )
            {
                this.tileset.setTile( 'top' + ( i + 11 ), i, 3 );
            }
        }

        for( let i = 0; i < 10; i++ )
        {
            if( i > 3 )
            {
                this.tileset.setTile( 'water' + ( i - 3 ), i, 3 );
            }
            
            this.tileset.setTile( 'water' + ( i + 7 ), i, 4 );

            if( i < 3 )
            {
                this.tileset.setTile( 'water' + ( i + 17 ), i, 5 );
            }

        }
    }

    _drawWalls( ctx )
    {
        // top and bottom
        for( let i = 0; i < this.numW; i++ )
        {
            // top
            this.tileset.drawTile( 'top4', ( i + 1 ) * this.gridSize, 0, ctx );
            this.tileset.drawTile( 'bricks1', ( i + 1 ) * this.gridSize, this.gridSize, ctx );

            // bottom
            this.tileset.drawTile( 'top4', ( i + 1 ) * this.gridSize, ( this.numH + 2 ) * this.gridSize, ctx );
            this.tileset.drawTile( 'bricks1', ( i + 1 ) * this.gridSize, ( this.numH + 3 ) * this.gridSize, ctx );
        }

        this.tileset.drawTile( 'bricks1', 0, ( this.numH + 3 ) * this.gridSize, ctx );
        this.tileset.drawTile( 'bricks1', ( this.numW + 1 ) * this.gridSize, ( this.numH + 3 ) * this.gridSize, ctx );

        // left and right
        for( let i = 0; i < this.numH + 1; i++ )
        {
            this.tileset.drawTile( 'top7', 0, ( i + 2 ) * this.gridSize - this.gridSize, ctx );
            this.tileset.drawTile( 'top7', ( this.numW + 1 ) * this.gridSize, ( i + 2 ) * this.gridSize - this.gridSize, ctx );
        }
        
        // corners
        this.tileset.drawTile( 'top6', 0, 0, ctx );
        this.tileset.drawTile( 'top10', ( this.numW + 1 ) * this.gridSize, 0, ctx );
        this.tileset.drawTile( 'top8', 0, ( this.numH + 2 ) * this.gridSize, ctx );
        this.tileset.drawTile( 'top12', ( this.numW + 1 ) * this.gridSize, ( this.numH + 2 ) * this.gridSize, ctx );
    }

    clearSelection()
    {
        this.selectedTileIndex = -1;
    }

    _drawSelectionBox( ctx )
    {
        ctx.strokeStyle = 'rgb(0, 200, 0)';
        ctx.lineWidth = 2;

        let dash1 = 10 - this.lineDashOffset;
        let dash2 = this.lineDashOffset;

        let dashes = [ dash2, 10, dash1, 0 ];
        dashes = [ 0, 5, 5, 0 ];
        ctx.setLineDash( dashes );

        let x = ( this.selectedTileIndex % this.numW ) + 1;
        let y = Math.floor( this.selectedTileIndex / this.numW ) + 2;

        ctx.strokeRect( x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize );
    }
    
    render( ctx )
    {
        let index = 0;
        for( let i = 0; i < this.numH; i++ )
        {
            for( let j = 0; j < this.numW; j++ )
            {
                index = ( i * this.numW ) + j;

                if( this.tileData[ i ][ j ] == 1 )
                {
                    let offset = this.getTileOffset( j, i );
                    this.tileset.drawTile( this.waterTiles[ offset ],
                        ( j + 1 ) * this.gridSize, ( i + 2 ) * this.gridSize, ctx );
                }
                else
                {
                    let tileIndex = this.tileRandomization[ index ] % 6;
                    let tile = this.floorTiles[ tileIndex ];
                    this.tileset.drawTile( tile,
                        ( j + 1 ) * this.gridSize, ( i + 2 ) * this.gridSize, ctx );
                }
            }
        }
        this._drawWalls( ctx );

        if( this.selectedTileIndex !== -1 )
        {
            this._drawSelectionBox( ctx );
        }
    }

    _movePlayerTo(x, y, index)
    {
        // let index = ( y * this.numW ) + x;

        let callback = ( index === -1 ) ? null : function()
        {
            if( this.selectCallback !== null )
            {
                this.selectCallback( this.itemLookup[ index ] );
            }
        }.bind( this );

        this.player.tweenPos( (x+1) * this.gridSize, (y+2) * this.gridSize, 1.0, callback);
    }

    mouseDown( p )
    {
        let gridX = Math.floor( p.x / this.gridSize ) - 1;
        let gridY = Math.floor( p.y / this.gridSize ) - 2;

        let index = ( gridY * this.numW ) + gridX;
        if( this.itemLookup.hasOwnProperty( index ) )
        {
            console.log( `clicked on ${this.itemLookup[ index ].name}` );

            if( this.itemLookup.hasOwnProperty( this.selectedTileIndex ) )
            {
                this.itemLookup[ this.selectedTileIndex ].setXOffset( 0 );                
            }

            this.selectedTileIndex = index;
            this.itemLookup[ index ].setXOffset(-20);
        }
        
        else
        {
            // this.player.setPos( (gridX + 1) * this.gridSize, (gridY+2) * this.gridSize );
            index = -1;
        }
        this._movePlayerTo( gridX, gridY, index );
        

        /*
        if( gridX >= 0 && gridX < this.numW )
        {
            if( gridY >= 0 && gridY < this.numH )
            {
                this.tileData[ gridY ][ gridX ] = ( this.tileData[ gridY ][ gridX ] == 1 ) ? 0 : 1;     
            }
        }
        */


    }
}