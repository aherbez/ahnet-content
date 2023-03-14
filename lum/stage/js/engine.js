"use strict";

let st = {};
st.LINEAR = Symbol( 'linear' );
st.EASE_IN = Symbol( 'ease-in' );
st.EPSILON = 0.01;
st._entityID = 0;

let GameInstance = null;

class Point
{
    constructor( x, y )
    {
        this.x = x || 0;
        this.y = y || 0;
    }

    sqDist()
    {
        return ( this.x * this.x + this.y * this.y );
    }
}

class stTween
{
    constructor( value, target, data )
    {
        this.startValue = value;
        this.animatingValue = value;
        this.animTime = 0;
        this.targetValue = target;
        
        this.easing = st.LINEAR;

        this.direction = 0;
        if (this.targetValue > this.startValue)
        {
            this.direction = 1;
        }
        else if( this.targetValue < this.startValue )
        {
            this.direction = -1;
        }

        this.duration = 1000;
        if( data.hasOwnProperty( 'duration' ) )
        {
            this.duration = data[ 'duration' ] * 1000;    
        }

        this.callback = null;
        if( data.hasOwnProperty( 'callback' ) )
        {
            this.finishedCallback = data[ 'callback' ];
        }

        this.updateFunction = null;
        if( data.hasOwnProperty( 'update' ) )
        {
            this.updateFunction = data['update'];    
        }

        this.active = true;
        if( Math.abs( value - target ) < st.EPSILON )
        {
            this.active = false;
        }        
    }

    // TODO: add in easing options
    update( dt )
    {
        if( !this.active ) return;

        this.animTime += dt;

        // linear
        let newValue = ((this.targetValue - this.startValue) * (this.animTime/this.duration)) + this.startValue;

        this.animatingValue = newValue;

        if( this.animTime > this.duration )
        {
            this.animatingValue = this.targetValue;
            this.active = false;

            if ( this.finishedCallback != null )
            {
                this.finishedCallback();
            }        
        }

        this._maybeUpdate();
    }

    _maybeUpdate()
    {
        if( this.updateFunction != null )
        {
            this.updateFunction( this.animatingValue );    
        }
    }
}

class Entity
{
    constructor()
    {
        this.pos = new Point();
        this.rotation = 0;
        this.scale = new Point();
        this.scale.x = 1;
        this.scale.y = 1;

        this._id = st._entityID++;

        this.width = 10;
        this.height = 10;

        this.active = true;
        this.totalTime = 0;

        this.parent = null;
        this.children = [];

        this._tweens = [];

        this.zIndex = 0;

    }

    tweenPos( newX, newY, duration, callback )
    {
        this._tweens.push( new stTween( this.pos.x, newX, {
            duration: duration,
            update: this._setX.bind( this ),
        } ) );
        this._tweens.push( new stTween( this.pos.y, newY, {
            duration: duration,
            update: this._setY.bind( this ),
            callback: callback
        } ) );
    }

    tweenPosX( newX, duration, callback )
    {
        this._tweens.push( new stTween( this.pos.x, newX, {
            duration: duration,
            update: this._setX.bind( this ),
            callback: callback
        } ) );
    }

    tweenPosY( newY, duration, callback )
    {
        this._tweens.push( new stTween( this.pos.y, newY, {
            duration: duration,
            update: this._setY.bind( this ),
            callback: callback
        } ) );
    }

    tweenRotation( r, duration, callback )
    {
        this._tweens.push( new stTween( this.rotation, r, {
            duration: duration,
            update: this._setRotation.bind( this ),
            callback: callback
        }))
    }

    _setX ( x )
    {
        this.pos.x = x;
    }

    _setY ( y )
    {
        this.pos.y = y;
    };

    _setScaleX( sX )
    {
        this.scale.x = sX;
    }

    _setScaleY( sY )
    {
        this.scale.y = sY;
    }

    _setRotation( r )
    {
        this.rotation = r;
    }

    addChild( e )
    {
        e.zIndex = this.children.length;
        this.children.push( e );
        e.parent = this;
        
        this.sortChildren();
    }

    removeChild( e )
    {
        let index = -1;
        for( let i = 0; i < this.children.length; i++ )
        {
            if( this.children[ i ]._id == e._id )
            {
                index = i;
                break;
            }    
        }

        if( index != -1 )
        {
            this.children.splice(index, 1);    
        }
    }

    setZIndex( z )
    { 
        this.zIndex = z;
        if( this.parent != null )
        {
            this.parent.sortChildren();
        }
    }

    sortChildren()
    {
        this.children = this.children.sort( ( a, b ) => {
            return b.zIndex - a.zIndex;   
        } );
    }

    setPos( x, y )
    {
        this.pos.x = x;
        this.pos.y = y;
    }

    _updateInternal( dt )
    {
        if( parseFloat( dt ) )
        {
            this.totalTime += dt;

            this.update( dt );

            if( this._tweens.length > 0 )
            { 
                this._tweens.forEach( t =>
                {
                    t.update( dt );
                } );
                this._tweens = this._tweens.filter( t => t.active );
            }

            this.children.forEach( c =>
            {
                c._updateInternal( dt );
            })
        }
    }

    update( dt )
    {
    }

    pointInside( p )
    {
        if( p.x < this.pos.x ) return false;
        if( p.y < this.pos.y ) return false;
        if( p.x > ( this.pos.x + this.width ) ) return false;
        if( p.y > ( this.pos.y + this.height ) ) return false;

        return true;
    }

    _mouseDownInternal( pos )
    {
        if( this.pointInside( pos ) )
        {
            this.mouseDown( pos );

            let offsetPoint = new Point( pos.x - this.pos.x, pos.y - this.pos.y );

            this.children.forEach( c =>
            {
                c._mouseDownInternal( offsetPoint );
            } );
        }
    }

    mouseDown( pos )
    {

    }

    _degToRad( d )
    {
        return ( d * Math.PI * 2 / 360 );
    }

    _render( ctx )
    {
        ctx.save();

        ctx.translate( this.pos.x, this.pos.y );
        ctx.rotate( this._degToRad( this.rotation ) );
        ctx.scale( this.scale.x, this.scale.y );
        
        this.render( ctx );

        this.children.forEach( e =>
        {
            e._render( ctx );
        })

        ctx.restore();
    }

    render( ctx )
    {

    }
}

class ImageEntity extends Entity
{
    constructor( imgSrc, origin )
    {
        super();

        this.image = new Image();
        this.image.onload = this._finishLoad.bind( this );
        this.image.src = imgSrc;

        this.rotation = 0;

        this.isLoaded = false;

        this.origin = new Point( 0.5, 0.5 );
        if( origin )
        {
            this.origin.x = origin[ 0 ];
            this.origin.y = origin[ 1 ];
        }
    }

    _finishLoad()
    {
        this.isLoaded = true;
        this.width = this.image.width;
        this.height = this.image.height;
    }

    // TODO: take transform into account
    pointInside( p )
    {
        if( p.x < this.pos.x - ( this.width * this.origin.x ) ) return false;
        if( p.y < this.pos.y - ( this.height * this.origin.y ) ) return false;
        if( p.x > this.pos.x + ( this.width * ( 1 - this.origin.x ) ) ) return false;
        if( p.y > this.pos.y + ( this.height * ( 1 - this.origin.y ) ) ) return false;
        return true;
    }
    
    _render( ctx )
    {
        if( this.isLoaded )
        {
            ctx.save();

            ctx.translate( this.pos.x, this.pos.y );
            ctx.rotate( this._degToRad( this.rotation ) );
            ctx.scale( this.scale.x, this.scale.y );

            ctx.drawImage( this.image,
                -( this.image.width * this.origin.x ),
                -( this.image.height * this.origin.y ) );

            this.render( ctx );

            this.children.forEach( e =>
            {
                e._render( ctx );
            } )            
            
            ctx.restore();
        }
    }

    render( ctx )
    {
        // console.log( "rendering image" );
    }
}

class Game
{
    constructor( canvasElementID )
    {
        this.canvas = document.getElementById( canvasElementID );
        this.ctx = this.canvas.getContext( "2d" );

        this._bounds = this.canvas.getBoundingClientRect();
        this.width = this._bounds.width;
        this.height = this._bounds.height;
        
        this.offscreenCanvas = document.createElement( "canvas" );
        this.offscreenCanvas.style.width = this.width;
        this.offscreenCanvas.style.height = this.height;
        this.offscreenCanvas.style.position = "absolute";
        this.offscreenCanvas.style.left = -100000;
        document.body.appendChild( this.offscreenCanvas );
        this.bufferCtx = this.offscreenCanvas.getContext( "2d" );

        this._lastUpdate = -1;

        this.imageList = [];
        this.entities = [];

        this.canvas.onmousedown = this._mouseDownRaw.bind(this);
        this.canvas.onmouseup = this._mouseUpRaw.bind(this);
        this.canvas.onmousemove = this._mouseMoveRaw.bind(this);

        // document.gameInstance = this;
        GameInstance = this;
        // this.update();
    }

    clearBuffer()
    {
        this.bufferCtx.clearRect(0, 0, this.width, this.height);
    }

    clipBuffer( w, h )
    {
        this.bufferCtx.beginPath();
        this.bufferCtx.moveTo( 0, 0 );
        this.bufferCtx.lineTo( w, 0 );
        this.bufferCtx.lineTo( w, h );
        this.bufferCtx.lineTo( 0, h );
        this.bufferCtx.lineTo( 0, 0 );
        this.bufferCtx.clip();        
    }

    init()
    {
        this._updateInternal( 0 );
    }

    sortChildren()
    {
        this.entities.sort( ( a, b ) =>
        {
            return b.zIndex - a.zIndex;
        } );
    }
    
    removeChild( e )
    {
        let index = -1;
        for( let i = 0; i < this.entities.length; i++ )
        {
            if( this.entities[ i ]._id == e._id )
            {
                index = i;
                break;
            }
        }

        if( index != -1 )
        {
            this.entities.splice( index, 1 );
        }
    }

    _cleanEventPoint( evt )
    {
        let p = new Point();
        p.x = evt.clientX - this._bounds.x;
        p.y = evt.clientY - this._bounds.y;
        return p;
    }

    _mouseDownRaw( evt )
    {
        let p = this._cleanEventPoint( evt );

        this.entities.forEach( e => {
            e._mouseDownInternal( p );
        } );

        this.mouseDown( p, evt );
    }

    _mouseMoveRaw( evt )
    {
        this.mouseMove( this._cleanEventPoint( evt ), evt );
    }

    _mouseUpRaw( evt )
    {
        this.mouseUp( this._cleanEventPoint( evt ), evt );
    }


    mouseDown( p, evt )
    {

    }

    mouseUp( p, evt )
    {
    }

    mouseMove( p, evt )
    {

    }

    addChild( e )
    {
        this.entities.push( e );
        e.parent = this;

        this.sortChildren();
    }

    _updateInternal( totalTime )
    {
        let deltaTime = 0;
        if( this._lastUpdate != -1 )
        {
            deltaTime = totalTime - this._lastUpdate;    
        }
        this._lastUpdate = totalTime;

        if( deltaTime == deltaTime )
        {
            this.entities.forEach( e =>
            {
                e._updateInternal( deltaTime );
            } );
        
            this.update( deltaTime );
        }

        this._clearCanvas();
        this.render( this.ctx );

        requestAnimationFrame( this._updateInternal.bind( this ) );
    }

    _clearCanvas( ctx )
    {
        this.ctx.clearRect( 0, 0, this.width, this.height );
    }

    _renderEntities( ctx )
    {
        // let s = "";
        this.entities.forEach( e =>
        {
            // s += ", " + e.zIndex;
            e._render( ctx );
        } );
        // console.log( s );
    }

    render( ctx )
    {
        this._renderEntities( ctx );
    }
}