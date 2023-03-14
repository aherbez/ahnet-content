class OutputSlot extends BaseWidget
{
    constructor()
    {
        super(230, 330);
        this.imageSrcs = [
            'img/Gnomebot_01.png',
            'img/Gnomebot_02.png',
            'img/Gnomebot_03.png',
            'img/Gnomebot_04.png',
            'img/Gnomebot_05.png'
        ];

        this.images = [];
    
        this._loadImages();

        this.botIndex = 0;
        this.droppingBot = false;
        this.botPos = -200;
        this.maxBotPos = -1;
    }

    _loadImages()
    {     
        for( let i = 0; i < this.imageSrcs.length; i++ )
        {
            let img = new Image();
            img.src = this.imageSrcs[ i ];
            this.images.push( img );
        }
    }

    update( dt )
    {
        if( this.droppingBot )
        {
            this.botPos += (dt/1000) * 20;
            if( this.botPos > this.maxBotPos )
            {
                this.botPos = this.maxBotPos;
            }
        }
    }

    dropBot( score, goal )
    {
        this.droppingBot = true;

        let diff = goal - score;


        this.botIndex = 4 - diff;
        if( this.botIndex < 0 ) this.botIndex = 0;
        if( this.botIndex > 4 ) this.botIndex = 4;

        this.maxBotPos = this.height + 500; // this.height - (this.images[ this.botIndex ].height * 0.2) - 30;
    }

    _drawBot()
    {
        ctx.save();
        ctx.translate( this.width / 2, 0 ); // this.height / 2 );

        ctx.scale( 0.2, 0.2 );
        ctx.translate( -this.images[ this.botIndex ].width / 2, -this.images[ this.botIndex ].height / 2 )

        ctx.drawImage( this.images[ this.botIndex ], 0, this.botPos );
        ctx.restore();
    }


    render( ctx )
    {
        ctx.save();
        ctx.translate( this.x, this.y );


        ctx.fillStyle = 'rgb(200,200,200)';
        ctx.fillRect( 0, 0, this.width, this.height );

        ctx.fillStyle = 'rgb(100, 100, 100)';
        ctx.fillRect( 10, 10, this.width - 20, this.height - 10 );

        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo( this.width * 0.2, 10 );
        ctx.lineTo( this.width * 0.2, this.height * 0.85 );
        ctx.lineTo( this.width * 0.8, this.height * 0.85 );
        ctx.lineTo( this.width * 0.8, 10 );
        
        ctx.moveTo( this.width * 0.2, this.height * 0.85 );
        ctx.lineTo( 10, this.height );

        ctx.moveTo( this.width * 0.8, this.height * 0.85 );
        ctx.lineTo( this.width - 10, this.height );

        ctx.stroke();

        if( this.droppingBot )
        {
            this._drawBot();
        }

        
        ctx.fillStyle = 'rgb(80, 80, 80)';
        ctx.fillRect( 0, -1000, this.width, 1000 );
        
        ctx.fillStyle = 'rgb(200,200,200)';
        ctx.fillRect( 0, 0, this.width, 10 );


        ctx.restore();
    }

}