class Clipboard extends ImageEntity
{
    constructor()
    {
        super( 'img/clipboard.png', [ 0.5, 0 ] );
        
        this.selectionCallback = null;
        this.choices = [];
    }

    init( data )
    {
        let choice;
        let xpos, ypos;
        // for( let i = 0; i < data.length; i++ )
        let index = 0;
        for (var key in data)
        {
            xpos = ( ( index % 3 ) * 210 ) - 300; 
            ypos = Math.floor( index / 3 ) * 210 + 230;

            choice = new ActButton( data[key].name, data[key].img, data[key].center );
            choice.setPos( xpos, ypos );
            choice.clickedCallback = this.choiceSelected.bind( this );
            this.choices.push( choice );
            this.addChild( choice );
            index++;
        }
    }

    update( dt )
    {

    }

    show()
    {
        this.tweenPosY( -50, 0.5 );
    }

    hide()
    {
        this.tweenPosY( 600, 0.5 );
    }

    choiceSelected( choice )
    {
        this.hide();
        
        if( this.selectionCallback != null )
        {
            this.selectionCallback( choice );
        }
    }

}