class Scroll extends Entity
{
    constructor()
    {
        super();
    
        this.topImg = new Image();
        this.topImg.src = "img/scrolltop.png";

        this.botImg = new Image();
        this.botImg.src = "img/scrollbot.png";

        this.backImg = new Image();
        this.backImg.src = "img/scrollback.png";

        this.open = false;

        this.width = 255;
        this.height = 122 + 300;
        
        this._animating = false;
        this._gapHeight = 0;
        this._scrollHeight = 61;

        this.storyText = "";

        this.textArea = new TextArea(250, 280);
        this.textArea.setPos( 20, this._scrollHeight + 15 );
        this.textArea.fontSize = 15;
        this.textArea.width = 200;
        this.textArea.textPosition = 0;
        this.textArea.height = 0;
        this.textArea.scroll = 0.5;
        this.textArea.overflow = st.OVERFLOW_HIDDEN;
        this.addChild( this.textArea );

        this.storyDisplayed = false;
        this.showStory();
    }
    
    mouseDown( p )
    {
        if( this.storyDisplayed )
        {
            this.hideStory();
        }
        else
        {
            this.showStory();
        }
    }

    hideStory()
    {
        if( !this.storyDisplayed ) return;

        this._tweens.push( new stTween( this._gapHeight, 0, {
            duration: 0.5,
            update: function( v )
            {
                this._gapHeight = v;
                this.textArea.height = this._gapHeight;
                this.height = v + 120;
            }.bind(this),
            callback: function() { this.storyDisplayed = false; }.bind(this)
        } ) );

    }

    showStory()
    {
        if( this.storyDisplayed ) return;

        this._tweens.push( new stTween( this._gapHeight, 300, {
            duration: 0.5,
            update: function(v)
            {
                this._gapHeight = v;
                this.textArea.height = this._gapHeight;
                this.height = v + 120;
            }.bind(this),
            callback: function() { this.storyDisplayed = true; }.bind(this)
        } ) );
    }

    update( dt )
    {
        this.textArea.scroll = 0;

    }

    setText( t )
    {
        this.textArea.text = t;
    }

    render( ctx )
    {
        // top image
        ctx.drawImage( this.topImg, 0, 0 );

        // back image, stretched
        ctx.save();
        ctx.translate(0, this._scrollHeight);
        ctx.scale( 1, this._gapHeight/100 );
        ctx.drawImage( this.backImg, 0, 0 );
        ctx.restore();

        // bottom image
        ctx.drawImage( this.botImg, 0, this._gapHeight + (this._scrollHeight) );

        // draw text
        /*
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillText( this.storyText, 20, this._scrollHeight + 15 );
        */
    }
}