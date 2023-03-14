class stRichText extends stTextArea
{
    constructor( w, h )
    {
        super( w, h );
        this._fontSize = 16;
        
        this.currentFontType = 0;
    }

    _parseLineForStyle( text, currentStyle )
    {
        let parts = [];
        let currPart = [];
        let style = currentStyle;
        let words = text.split( ' ' );

        words.forEach( ( word ) =>
        {
            if( word[ 0 ] == "*" )
            {
                word = word.slice( 1 );
                parts.push( {
                    "text": currPart.join( " " ),
                    "style": style
                } );
                currPart = [word];
                style = 1;
            }
            else if( word[ word.length - 1 ] == "*" )
            {
                word = word.slice( 0, -1);
                currPart.push( word );
                parts.push( {
                    "text": currPart.join( " " ),
                    "style": style
                } );
                currPart = [];
                style = 0;
            }
            else
            {
                currPart.push( word );
                
            }
        } );
        parts.push( {
            "text": currPart.join( " " ),
            "style": style
        } );
        return [ parts, style ];
    }


    _recalcText( ctx )
    {
        this.font = `${this._fontSize}px ${this._fontFamily}`;
        this.boldFont = `bold ${this.font}`;
        this.italicFont = `italic ${this.font}`;
        ctx.save();
        ctx.font = this.font;

        this._textLines.length = 0;

        let words = this.textContent.split( ' ' );
        let currentLine = '';
        let testline = currentLine;
        let metrics = null;

        let NORMAL = 0;
        let BOLD = 1;
        let ITALIC = 2;

        let current = NORMAL;

        let overflow = false;
        let currLine = '';

        words.forEach( ( word, i ) =>
        {
            overflow = false;

            testline = currentLine + ' ' + word;
            metrics = ctx.measureText( testline );
            overflow = ( metrics.width > this._width );

            if( overflow )
            {                
                [ currLine, current ] = this._parseLineForStyle( currentLine, current );
                this._textLines.push( currLine );
                currentLine = word;
            }
            else
            {
                currentLine = testline;
            }

        } );
        [ currLine, current ] = this._parseLineForStyle( currentLine, current );
        this._textLines.push( currLine );

        this._totalHeight = ( this._textLines.length * this._fontSize * this.verticalSpacing );
        this._textDirty = false;

        ctx.restore();


    }

    _maybeSwitchFontStyle(ctx, fontType)
    {
        if( fontType == this.currentFontType ) return;

        switch( fontType )
        {
            case 0:
                ctx.font = this.font;
                break;
            case 1:
                ctx.font = this.boldFont;
                break;
            case 2:
                ctx.font = this.italicFont;
                break;
            default:
                ctx.font = this.font;
        }
        this.currentFontType = fontType;
    }

    render( ctx )
    {
        if( this._textDirty ) this._recalcText( ctx );

        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = this._fontAlign;

        let ypos = 0;
        let xpos = 0;
        this._textLines.forEach( ( t, i ) =>
        {
            ypos = ( i * this._fontSize * this.verticalSpacing ) + this._textPosition;

            if( this.overflow == st.OVERFLOW_VISIBLE ||
                ( ( ypos >= 0 ) && ( ypos < this.height ) ) )
            {
                // ctx.fillText( t, 0, ypos );
                xpos = 0;
                t.forEach( ( part ) =>
                {
                    this._maybeSwitchFontStyle( ctx, part.style );
                    ctx.fillText( part.text, xpos, ypos );

                    xpos += ctx.measureText( part.text+' ' ).width;
                } );
            }
        } );
    }
}

class StoryBook extends stEntity
{
    constructor()
    {
        super();
        this.backImage = new stImageEntity( 'img/storybook.png', [ 0, 0 ]);
        this.addChild( this.backImage );

        this.pageWidth = 200;
        this.pageHeight = 5000;

        this.width = 640;
        this.height = 480;

        this.leftPage = new stRichText( this.pageWidth, this.pageHeight );
        this.leftPage.setPos( 80, 50 );
        this.addChild( this.leftPage );

        this.rightPage = new stRichText( this.pageWidth, this.pageHeight );
        this.rightPage.setPos( 330, 50 );
        this.addChild( this.rightPage );
    }

    setPageText( left, right )
    {
        this.leftPage.text = left;
        this.rightPage.text = right;
    }

    render( ctx )
    {

    }

    mouseDown( p )
    {
        if( !this.active ) return;

        console.log( 'click!' );
        if( this.clickCallback != null )
        {
            this.clickCallback();
        }
    }

}