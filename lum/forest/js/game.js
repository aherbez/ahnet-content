class Game
{
    constructor(width, height, ctx)
    {
        this.isLoaded = false;
        
        this.width = width;
        this.height = height;
        this.ctx = ctx;

        this.imageSet = new ImageSet( this.ctx );
        this.imageSet.setBounds( this.width, this.height );
        this.loadImages();

        this.frameSize = 499;

        this.textColor = 'rgb(255, 255, 255)';
        this.fontTitle = '25px Arial';
        this.fontText = '18px Arial';

        this.walkPos = 0;
        this.isWalking = false;
        this.nextPos = 0;

        this.totalBackWidth = -1;

        this.minBackPos = -1;

        this.WALK_SPEED = 150;
        
        this.showInstructions = true;
        this.showHint = false;

        this.currPlaceIndex = -1;

        this.markersPlaced = [ 0, 0, 0 ];
        this.markersOnSign = [];
        this.playerActions = [];

        this.drawResults = false;
        
        this.clickTargets = [
            {
            x: this.width / 2 - 60,
            y: 150,
            r: 19,
            id: 'btn-star'
            },
            {
                x: this.width / 2,
                y: 150,
                r: 19,
                id: 'btn-moon'
            },
            {
                x: this.width / 2 + 60,
                y: 150,
                r: 19,
                id: 'btn-paw'
            },
            {
                x: this.width - 80,
                y: this.height - 80,
                r: 45,
                id: 'radio'
            },
            {
                x: this.width/2 - 80,
                y: this.height - 60,
                w: 160,
                h: 40,
                id: 'continue'
            },
            {
                x: 250,
                y: 400,
                w: 160,
                h: 40,
                id: 'start'
            }            
        ];

        this.markersPlaced = [];

        
        this.instructions = [
            {
                index: 1,
                icon: 'mrk-star',
                icons: [0],
                deer: true,
            },
            {
                index: 6,
                icon: 'mrk-moon',
                icons: [1],
                deer: false,
            },
            {
                index: 10,
                icon: 'mrk-star',
                icons: [0],
                deer: true,
            }
        ];

        this.placeNames = [
            'Basin Valley',
            'Elk Ridge',
            'Granite Valley',
            'Someplace Green',
            'Rickey Bridge',
            'Scenic Overlook',
            'Big Basin',
            'Boulder Hangout',
            'Deep Forest',
            'Deeper Forest',
            'Mammoth Pass',
            'Mallard Gorge',
        ];
        

        this.iconNames = [ 'mrk-star', 'mrk-moon', 'mrk-paw' ];
    }

    loadImages()
    {
        this.imageSet.loadImage( 'back', 'img/background.png' );
        this.imageSet.loadImage( 'deer', 'img/deer.png', [0.5, 1] );
        this.imageSet.loadImage( 'hiker', 'img/hiker.png', [0.5, 1] );
        this.imageSet.loadImage( 'sign', 'img/sign-post.png', [0.5,1]);
        this.imageSet.loadImage( 'radio', 'img/hint_icon.png', [0.5, 0.5]);
        this.imageSet.loadImage( 'map', 'img/map.png', [0.5,0.5] );

        this.imageSet.loadImage( 'btn-star', 'img/star_button.png', [0.5, 0.5] );
        this.imageSet.loadImage( 'btn-paw', 'img/paw_button.png', [0.5, 0.5]);
        this.imageSet.loadImage( 'btn-moon', 'img/moon_button.png', [0.5, 0.5]);
        this.imageSet.loadImage( 'btn-radio', 'img/hint_button.png', [ 0.5, 0.5 ] );
    
        this.imageSet.loadImage( 'mrk-star', 'img/marker_star.png' );
        this.imageSet.loadImage( 'mrk-moon', 'img/marker_moon.png' );
        this.imageSet.loadImage( 'mrk-paw', 'img/marker_paw.png' );

        // UI
        this.imageSet.loadImage( 'btn-continue', 'img/continue_button.png', [ 0.5, 0.5 ] );
        this.imageSet.loadImage( 'btn-start', 'img/start_button.png', [0.5,0.5] );

        this.minBackPos = -this.imageSet.getWidth( 'back' );
    }


    update( dt )
    {
        if( this.isWalking )
        {
            if( this.walkPos > this.nextPos )
            {

                this.walkPos -= (( dt / 1000 ) * this.WALK_SPEED);

                if( this.walkPos <= this.nextPos )
                {
                    this.walkPos = this.nextPos;
                    this.isWalking = false;
                }
            }
        }
    }

    _clipCanvas(ctx)
    {
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillRect( 0, 0, this.width, this.height );
    }

    _getMapMarkerPos( index )
    {
        let x = ( index % 4 ) * 120 + 147;
        
        if( index > 3 && index < 8 )
        {
            x = ( index % 4 ) * -120 + 505    
        }

        let y = (Math.floor(index/4) * 82) + 165;

        return {
            x: x,
            y: y
        }
    }

    _drawMap( ctx )
    {
        ctx.save();

        this.imageSet.draw( 'map', this.width / 2, this.height / 2 );
        this.imageSet.draw( 'btn-start', this.width / 2, this.height * 0.85 );

        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.textAlign = "center";
        ctx.font = this.fontTitle;
        ctx.fillText( 'Forest Ranger Recall', this.width/2, 70 );

        ctx.font = this.fontText;

        ctx.font = '16px Arial';
        let instructionText = ["You are maintaining the trails in a national park. Place tail makers only on locations",
            "listed on this map. Use your walkie talkie if you forget where to place markers.",
            "Click START when you are ready"];
        
        for( let i = 0; i < instructionText.length; i++ )
        {
            ctx.fillText( instructionText[i], this.width / 2, 100 + (i * 22) );            
        }
        


        this.imageSet.draw( 'mrk-paw', 100, 365 );
        ctx.fillText('If you see a deer, also place a paw marker.', this.width/2, 385);

        ctx.save();
        ctx.textAlign = "left";
        for( let i = 0; i < this.instructions.length; i++ )
        {
            let pos = this._getMapMarkerPos( this.instructions[ i ].index );
            let iconImg = this.iconNames[ this.instructions[ i ].icons[ 0 ]];
            this.imageSet.draw( iconImg, pos.x - 10, pos.y - 10 );
            
            ctx.fillText( this.placeNames[ this.instructions[ i ].index ], pos.x + 20, pos.y + 8 );
        }
        ctx.restore();

        ctx.restore();
    }

    _drawScene( ctx )
    {
        this.imageSet.draw( 'back', this.walkPos, 0 );
        this.imageSet.draw( 'back', this.walkPos + 5996, 0 );

        for( let i = 0; i < this.instructions.length; i++ )
        {
            if( this.instructions[ i ].deer )
            {
                this.imageSet.draw( 'deer',
                    ( (this.instructions[ i ].index + 1) * 500 ) + this.walkPos +
                        ( this.width * 0.65 ),
                    this.height * 0.85 );
            }    
        }

        for( let i = 0; i < 12; i++ )
        {
            this.imageSet.draw( 'sign', this.width / 2 + ( i * 500 ) + this.walkPos, this.height - 20 );
        }

        let hikerBob = Math.sin( this.walkPos * 0.1 ) * 10;

        this.imageSet.draw( 'hiker', this.width * 0.25, this.height + hikerBob + 50 );
        
    }

    _drawFrame( width, color )
    {
        ctx.save();

        ctx.fillStyle = color;
        ctx.fillRect( 0, 0, this.width, width );
        ctx.fillRect( 0, this.height - width, this.width, width );
        ctx.fillRect( 0, 0, width, this.height );
        ctx.fillRect( this.width - width, 0, width, this.height );

        ctx.restore();
    }

    _drawMarkers(ctx)
    {
        ctx.save();

        ctx.translate( this.width / 2, 150 );

        let btnImages = ['btn-star', 'btn-moon', 'btn-paw'];
        let xpos = 0;

        ctx.fillStyle = 'rgba(0,0,0, 0.5)';
        for( let i = 0; i < 3; i++ )
        {
            xpos = ( i * 60 ) - 60;
            ctx.beginPath();
            ctx.arc( xpos, 0, 19, 0, Math.PI * 2 );
            ctx.fill();

            if( this.markersPlaced[i] == 0 )
            {
                this.imageSet.draw( btnImages[ i ], xpos, 0 );
            }
        }

        ctx.restore();
    }

    _drawSign( ctx )
    {
        // this.imageSet.draw( 'sign', this.width / 2, this.height - 20 );

        let signMarkers = ['mrk-star', 'mrk-moon', 'mrk-paw'];

        let x = 0;
        let y = this.height - 125;
        for( let i = 0; i < this.markersOnSign.length; i++ )
        {
            x = this.width / 2; //  - ( ( this.markersOnSign.length - 1 ) / 2 ) * 20;
            x += ( i * 30 );
            x -= ( ( this.markersOnSign.length ) / 2 ) * 30;
            x -= 5;
            this.imageSet.draw( signMarkers[ this.markersOnSign[ i ] ], x, y );
        }
    }

    _drawUI( ctx )
    {
        ctx.save();


        let placeName = this.placeNames[this.currPlaceIndex];

        ctx.font = this.fontTitle;
        ctx.fillStyle = this.textColor;
        ctx.textAlign = "center";
        
        ctx.fillText( placeName, this.width / 2, 60 );
        
        ctx.font = this.fontText;
        ctx.fillText("Select the trail markers to place at this location", this.width/2, 90);

        this._drawMarkers(ctx);

        this._drawSign( ctx );

        this.imageSet.draw( 'btn-radio', this.width - 80, this.height - 80 );
        this.imageSet.draw( 'btn-continue', this.width / 2, this.height - 40 );

        ctx.restore();
    
        this._drawFrame( 10, 'rgb(0,0,0)' );

    }

    _drawHint( ctx )
    {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect( 0, 0, this.width, this.height );

        ctx.translate( this.width/2, this.height * 0.4 );

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(-200, -100, 400, 200);

        // draw text
        ctx.fillStyle = this.textColor;
        ctx.font = this.fontText;

        ctx.textAlign = 'center';
        ctx.fillText( 'Click to close', 0, 85 );
        ctx.fillText( '    If you see a deer, also place a paw marker', 0, 55 );

        this.imageSet.draw( 'radio', -170, -70 );
        this.imageSet.draw('mrk-paw', -190, 35);

        let placeName = '';
        ctx.textAlign = 'left';
        
        for( let i = 0; i < this.instructions.length; i++ )
        {
            placeName = this.placeNames[this.instructions[i].index];
            let iconImg = this.iconNames[ this.instructions[ i ].icons[ 0 ] ];
            
            this.imageSet.draw( iconImg, -130, i * 40 - 80 );    
            ctx.fillText( placeName, -95, i * 40 - 62 );    
        }

        ctx.restore();
    }

    _drawResults( ctx )
    {
        ctx.save();

        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect( 0, 0, this.width, this.height );

        ctx.translate( this.width / 2, 50 );

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect( -200, 0, 400, 400 );

        ctx.fillStyle = this.textColor;
        ctx.font = this.fontText;

        // ctx.textAlign = 'center';
        // ctx.fillText( 'RESULTS', 0, 30 );


        let iconImg = null;
        let placename = "";

        let lineSpacing = 30;
        let ypos = 30;
        
        ctx.textAlign = 'left';

        ctx.fillText( 'Requested:', -180, ypos );
        ypos += 30;

        let iconsToDraw = null;
        for( let i = 0; i < this.instructions.length; i++ )
        {
            iconsToDraw = this.instructions[ i ].icons.slice();
            if( this.instructions[ i ].deer )
            {
                iconsToDraw.push( 2 );
            }
            iconsToDraw.sort();

            for( let j = 0; j < iconsToDraw.length; j++ )
            {
                iconImg = this.iconNames[iconsToDraw[ j ]];
                this.imageSet.draw( iconImg, -120 - (j * 30), ypos );                
            }

            placename = this.placeNames[ this.instructions[ i ].index ];
            ctx.fillText( placename, -80, ypos + 20 );
            ypos += lineSpacing
        }      

        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();
        ctx.moveTo( -180, ypos );
        ctx.lineTo( 180, ypos );
        ctx.stroke();
        ypos += lineSpacing;
        

        ctx.fillText( 'Placed:', -180, ypos );
        ypos += lineSpacing;

        for( let i = 0; i < this.playerActions.length; i++ )
        {
            iconsToDraw = this.playerActions[i].icons.slice().sort();
            for( let j = 0; j < iconsToDraw.length; j++ )
            {
                iconImg = this.iconNames[iconsToDraw[ j ]];
                this.imageSet.draw( iconImg, -120 - ( j * 30 ), ypos );
            }
            placename = this.placeNames[ this.playerActions[ i ].index ];
            ctx.fillText( placename, -80, ypos + 20 );
            ypos += lineSpacing            
        }


        ctx.restore();
    }

    _checkClick( pos )
    {
        let dx = 0;
        let dy = 0;
        let dist = 0;
        let radSq = 0;
        for( let i = 0; i < this.clickTargets.length; i++ )
        {
            if( this.clickTargets[ i ].hasOwnProperty( 'r' ) )
            {
                radSq = this.clickTargets[ i ].r * this.clickTargets[ i ].r;
                dx = pos.x - this.clickTargets[ i ].x;
                dy = pos.y - this.clickTargets[ i ].y;
                dist = ( dx * dx + dy * dy );

                if( dist <= radSq )
                {
                    return this.clickTargets[ i ].id;
                }
            }
            else
            {
                let clickedOn = true;
                if ( pos.x < this.clickTargets[ i ].x ) clickedOn = false;
                if( pos.y < this.clickTargets[ i ].y ) clickedOn = false;
                if( pos.x > ( this.clickTargets[ i ].x + this.clickTargets[ i ].w ) ) clickedOn = false;
                if( pos.y > ( this.clickTargets[ i ].y + this.clickTargets[ i ].h ) ) clickedOn = false;

                if( clickedOn )
                {
                    return this.clickTargets[ i ].id;
                }
            }

            
        }
        return null;
    }

    _placeMarker( id )
    {
        let index = this.markersOnSign.indexOf( id );
        if( this.markersPlaced[ id ] == 0 )
        {
            this.markersPlaced[ id ] = 1;
            if( index == -1 )
            {
                this.markersOnSign.push( id );
            }    
        }
        else
        {
            this.markersPlaced[ id ] = 0;
            if( index != -1 )
            {
                this.markersOnSign.splice( index, 1 );
            }
        }

    }

    moveToNextStop()
    {
        if( !this.isWalking && this.currPlaceIndex < this.placeNames.length)
        {

            this.showInstructions = false;

            if (this.markersOnSign.length > 0)
            {
                this.playerActions.push( {
                    index: this.currPlaceIndex,
                    icons: this.markersOnSign.slice(),
                } );
            }
            
            this.markersOnSign = [];
            this.markersPlaced = [ 0, 0, 0 ];
            this.currPlaceIndex++;
            if( this.currPlaceIndex >= this.placeNames.length )
            {
                this.drawResults = true;
            }

            this.isWalking = true;
            this.nextPos -= this.frameSize;            
        }
    }

    mouseDown( clickPos )
    {
        if( this.showHint )
        {
            this.showHint = false;
            return;
        }

        if( !this.isWalking )
        {
            let clickedOn = this._checkClick( clickPos );
            console.log( clickedOn );

            if( clickedOn )
            {
                switch( clickedOn )
                {
                    case 'btn-star':
                        this._placeMarker( 0 );
                        break;
                    case 'btn-moon':
                        this._placeMarker( 1 );
                        break;
                    case 'btn-paw':
                        this._placeMarker( 2 );
                        break;
                    case 'radio':
                        this.showHint = true;
                        break;
                    case 'continue':
                        this.moveToNextStop();
                        break;
                    case 'start':
                        this.moveToNextStop();
                        break;
                    default:
                        break;
                }
            }
        }
    }

    render( ctx )
    {
        ctx.save();
        ctx.clearRect( 0, 0, this.width, this.height );

        this._drawScene( ctx );

        if( !this.isWalking )
        {
            if( this.drawResults )
            {
                this._drawResults( ctx );
            }
            else
            {
                this._drawUI( ctx );
            }
        }

        if( this.showInstructions )
        {
            this._drawMap( ctx );
        }

        if( this.showHint )
        {
            this._drawHint( ctx );
        }



        this._clipCanvas( ctx );

        ctx.restore();
    }
}