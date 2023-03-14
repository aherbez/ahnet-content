class Shape
{
    constructor()
    {
        this.pos = [];

        this.rotation = Math.random() * Math.PI * 2;
        this.width = Math.random() * 70 + 20;
        this.height = Math.random() * 70 + 20;

        this.type = Math.floor( Math.random() * 3 );
        this.type = 2;
    }

    setPos( pos )
    {
        this.pos[ 0 ] = pos[0];
        this.pos[ 1 ] = pos[1];
    }

    render( ctx )
    {
        ctx.save();
        
        ctx.translate( this.pos[ 0 ], this.pos[ 1 ] );
        ctx.rotate( this.rotation );

        ctx.beginPath();
        
        switch( this.type )
        {
            case 0:
                ctx.arc( 0, 0, this.width, 0, Math.PI * 2 );
                break;
            case 1:
                ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
                break;
            case 2:
                ctx.moveTo( -this.width / 2, this.height / 2 );
                ctx.lineTo( this.width / 2, this.height / 2 );
                ctx.lineTo( 0, -this.height / 2 );
                ctx.lineTo( -this.width / 2, this.height / 2 );
                ctx.fill();
                break;
        }

        ctx.fill();
        ctx.restore();
    }
}


class Flake
{
    constructor(size) {
        this.size = size;

        this.fill = 'rgb(255,255,255)';
        this.stroke = 'rgb(0,0,0)';

        this.shapes = [];

        this.points = [];
        this.drawpoints = [];

        this.extraPoints = 4;


        this.initPoints();
        this.makeShapes(10);
    }

    initPoints()
    {
        let theta1 = Math.PI * 1.5 - ( Math.PI / 6 );
        let theta2 = Math.PI * 1.5 + ( Math.PI / 6 );

        this.points[ 0 ] = [Math.cos( theta1 ) * this.size, Math.sin( theta1 ) * this.size ];
        this.points[ 1 ] = [Math.cos( theta2 ) * this.size, Math.sin( theta2 ) * this.size ];
        this.points[ 2 ] = [ 0, 0 ];

        this.drawpoints.push( this.points[ 0 ] );
        for( let i = 1; i < this.extraPoints; i++ )
        {
            let theta = ( ( ( theta2 - theta1 ) / ( this.extraPoints - 1 ) ) * i ) + theta1;
            let p = [];

            let r = ((Math.random() * 0.4) + 0.8) * this.size;

            p[ 0 ] = Math.cos( theta ) * r;
            p[ 1 ] = Math.sin( theta ) * r;
            this.drawpoints.push( p );

        }
        this.drawpoints.push( this.points[ 1 ] );
        this.drawpoints.push( this.points[ 2 ] );
        
        // alert( this.drawpoints.length );
    }

    randomPoint()
    {
        let pos = [ 0, 0 ];
        
        let weights = [];
        let weightSum = 0;
        
        for( let i = 0; i < this.points.length; i++ )
        {
            weights[ i ] = Math.random();
            weightSum += weights[ i ];
        }        

        let w = 0;
        for( let i = 0; i < this.points.length; i++ )
        {
            w = weights[ i ] / weightSum;
            pos[ 0 ] += w * this.points[ i ][ 0 ];
            pos[ 1 ] += w * this.points[ i ][ 1 ];
        }

        return pos;
    }

    makeShapes(num)
    {
        for( let i = 0; i < num; i++ )
        {
            let s = new Shape();
            s.setPos( this.randomPoint() );
            this.shapes.push( s );
        }
    }

    drawSlice( ctx, flip )
    {
        ctx.save();

        if( flip )
        {
            ctx.scale( -1, 1 );
        }

        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;

        ctx.beginPath();
        ctx.moveTo( 0, 0 );
        for( let i = 0; i < this.drawpoints.length; i++ )
        {
            ctx.lineTo( this.drawpoints[ i ][ 0 ], this.drawpoints[ i ][ 1 ] );
        }
        
        ctx.closePath();
        ctx.stroke();
        ctx.fill();


        // draw cutouts
        ctx.globalCompositeOperation = "destination-out";

        for( let i = 0; i < this.shapes.length; i++ )
        {
            this.shapes[ i ].render( ctx );
        }    

        ctx.restore();

    }

    drawSnowflake( ctx )
    {
        for( let i = 0; i < 6; i++ )
        {
            ctx.save();
            
            ctx.rotate( Math.PI / 3 * i );
            this.drawSlice( ctx, (i % 2 == 1));
            ctx.restore();
        }
    }
}