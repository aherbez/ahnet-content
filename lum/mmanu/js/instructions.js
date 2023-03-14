class Instructions
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;

        this.baseBlue = 'rgb(70, 61, 150)';
        this.lineColor = 'rgb(255, 255, 255)';
    }

    init( actions )
    {
        this.actions = actions.slice();
    }

    _drawSheet( ctx )
    {
        ctx.save();
        ctx.fillStyle = this.baseBlue;
        ctx.fillRect( 0, 0, this.width, this.height );

        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = 2;
        ctx.strokeRect( 10, 10, this.width - 20, this.height - 20 );




        ctx.restore();
    }

    _drawSingleInstruction( ctx, index, showResults)
    {
        let data = this.actions[ index ];

        let ySize = 50;

        ctx.save();
        ctx.strokeStyle = this.lineColor;
        ctx.fillStyle = this.lineColor;

        let instructionsText = (index + 1) + ") ";
        switch( data.type )
        {
            case 'DIAL':
                instructionsText += "Set the DIAL like this ";

                ctx.save();
                ctx.lineWidth = 1;
                ctx.translate(280, -30);
                ctx.strokeRect( 0, 0, 150, 40 );

                ctx.beginPath();

                ctx.moveTo( 7, 11 );
                ctx.lineTo( 32, 5 );
                ctx.lineTo( 75, 2 );
                ctx.lineTo( 114, 5 );
                ctx.lineTo( 143, 11 );
                ctx.lineTo( 140, 35 );
                ctx.lineTo( 113, 30 );
                ctx.lineTo( 75, 28 );
                ctx.lineTo( 37, 30 );
                ctx.lineTo( 10, 35 );
                ctx.lineTo( 7, 11 );
                ctx.stroke();

                let xpos = data.value * 130 + 10;
                let ypos = Math.cos( data.value * Math.PI ) * -5 + 30;

                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo( xpos, ypos );
                ctx.lineTo( xpos, ypos - 20 );
                ctx.stroke();

                ctx.restore();
                
                ctx.fillText( instructionsText, 0, 0 );
                break;
            case 'BUTTONPANEL':
                instructionsText += "Set the BUTTONS like this ";

                ctx.save();

                ySize = data.value.length * 40;

                for( let i = 0; i < data.value.length; i++ )
                {
                    for( let j = 0; j < data.value[ i ].length; j++ )
                    {
                        ctx.strokeRect( j * 40 + 280, i * 40 - 30, 34, 34 );
                        
                        if( data.value[ i ][ j ] == 1 )
                        {
                            ctx.beginPath();
                            ctx.arc( j * 40 + 280 + 17, i * 40 - 30 + 17, 10, 0, Math.PI * 2 );
                            ctx.stroke();
                        }

                    }
                }


                ctx.restore();
                
                ctx.fillText( instructionsText, 0, 0 );
                break;
            case 'SWITCHES':
                instructionsText += "Set the SWITCHES like this "
                ctx.fillText( instructionsText, 0, 0 );

                for( let i = 0; i < data.value.length; i++ )
                {
                    ctx.save();
                    ctx.translate( 280 + ( i * 30 ), -30 );
                    ctx.strokeRect( 0, 0, 25, 40 );
                    
                    let ypos = ( data.value[ i ] == 1 ) ? -15 : 15;
                    ctx.beginPath();
                    ctx.moveTo( 5, 20 );
                    ctx.lineTo( 3, 20 + ypos );
                    ctx.lineTo( 22, 20 + ypos );
                    ctx.lineTo( 20, 20 );
                    ctx.lineTo( 5, 20 );

                    ctx.stroke();

                    ctx.restore();
                }

                break;
            case 'SLIDERS':
                instructionsText += "Set the SLIDERS like this "

                for( let i = 0; i < data.value.length; i++ )
                {
                    ctx.save();
                    ctx.fillStyle = this.baseBlue;

                    ctx.translate( 280, i * 40 - 30 );
                    ctx.strokeRect( 0, 0, 150, 35 );

                    ctx.beginPath();
                    ctx.moveTo( 10, 17 );
                    ctx.lineTo( 140, 17 );
                    ctx.stroke();

                    // ctx.fillStyle = 'rgb(255, 0,0)';
                    ctx.fillRect( (data.value[i] * 130) + 10 - 5, 5, 10, 25 );
                    ctx.strokeRect( (data.value[i] * 130) + 10 - 5, 5, 10, 25 );

                    ctx.restore();
                }
                
                ySize = data.value.length * 40;
                
                ctx.fillText( instructionsText, 0, 0 );
                break;
            case 'KEYPAD':
                instructionsText += "Set the KEYPAD to ";

                ctx.fillStyle = this.lineColor;                
                ctx.save();
                ctx.fillText( instructionsText, 0, 0 );

                ctx.strokeRect( 280, -30, 70, 40 );

                ctx.fillText( data.value, 290, 0 );
                ctx.restore();
                
                break;
            case 'MAKEITSO':
                instructionsText += "Click the BIG BUTTON!";
                ctx.fillText( instructionsText, 0, 0 );
                
                break;
        }

        if((data.type != 'MAKEITSO') && showResults )
        {
            ctx.save();
            ctx.translate( 480, -30 );
            
            ctx.strokeRect( 0, 0, 40, 40 );

            if( false )
            {
                ctx.beginPath();
                ctx.moveTo( 10, 10 );
                ctx.lineTo( 30, 30 );
                ctx.lineTo(80, -30);
                ctx.stroke();
            }
            else
            {
                ctx.beginPath();
                ctx.moveTo( 10, 10 );
                ctx.lineTo( 30, 30 );
                ctx.moveTo( 30, 10 );
                ctx.lineTo( 10, 30 );
                ctx.stroke();
            }

            ctx.restore();
        }

        ctx.restore();
        
        return ySize;
    }

    _drawInstructions( ctx )
    {
        ctx.save();
        ctx.fillStyle = this.lineColor;
        ctx.font = "30px Arial";
        ctx.textAlign = "left";
        ctx.fillText( 'INSTRUCTIONS', 20, 50 );
        ctx.strokeStyle = this.lineColor;
        ctx.strokeRect( 10, 10, 260, 50 );


        ctx.textAlign = "left";
        ctx.font = "20px Arial";

        let instructionsText = "";
        let ypos = 90;
        for( let i = 0; i < this.actions.length; i++ )
        {   
            ctx.save();
            ctx.translate( 100, ypos);

            ypos += this._drawSingleInstruction( ctx, i );

            ctx.restore();
        }    

        ctx.restore();
    }

    render( ctx )
    {
        ctx.save();

        this._drawSheet( ctx );

        this._drawInstructions( ctx );

        ctx.restore();
    }
}