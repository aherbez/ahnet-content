class Candy extends Entity
{
    constructor(chocolate, shape, topping)
    {
        super();

        this.chocolateType = chocolate;
        this.shape = shape;
        this.topping = topping;

        this.toppingImg = null;




        this.backImg = new ImageEntity( 'img/chocolate_dish.png', [ 0.5, 0.5 ] );
        this.addChild( this.backImg );

        this.backImg.setPos( 0, 10 );

        let imgSrc = `img/choc_${this.chocolateType + 1}_${this.shape + 1}.png`;
        this.baseImg = new ImageEntity( imgSrc, [ 0.5, 0.5 ] );
        this.addChild( this.baseImg );

        if( topping >= 1 )
        {
            this.toppingImg = new ImageEntity( `img/topping_${this.topping}.png`, [ 0.5, 0.5 ] );
            this.toppingImg.setPos( 0, -15 );
            this.addChild( this.toppingImg );

        }

    }

}