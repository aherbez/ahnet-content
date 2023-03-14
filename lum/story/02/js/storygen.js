class StoryStep
{
    constructor(items)
    {
        this.items = items.slice();

        this.text = '';
    }

    check( itemsSelected )
    {
        let selectedIDs = itemsSelected.map( item => item.id );
        let targetIDs = this.items.map( item => item.id );

        console.log( selectedIDs, targetIDs );

        let completed = true;
        targetIDs.forEach( ( t ) =>
        {
            console.log(t, selectedIDs.indexOf( t ) );
            if( selectedIDs.indexOf( t ) === -1 ) completed = false;
        } );
        return completed;
    }

}

class Storyteller
{
    constructor( stepTemplates, itemList, extraStatements )
    {
        this.itemList = itemList;
        this.stepTemplates = stepTemplates;
        this.extraStatements = extraStatements;
        this.numSteps = 5;

        this.storySteps = [];

        this.inventoryItems = [];
        this.characters = [];
        this.levelItems = [];

        // this.genStory( this.numSteps );
        
        st.shuffleArray( this.extraStatements );

        this.currentStepIndex = 0;
    }

    checkStep( itemsSelected )
    {
        if( this.currentStepIndex >= this.storySteps.length ) return false;

        if( this.storySteps[ this.currentStepIndex ].check( itemsSelected ) )
        {
            this.currentStepIndex++;
            return true;
        }
        return false;
    }
    
    getText()
    {
        let s = 'The hero entered the dungeon. ';

        let sentenceStarts = [ 'Then they', 'Next, they', 'Afterwards, they' ];
        let sentenceIndex = 0;

        this.storySteps.forEach( ( step, i ) =>
        {
            if( i == this.storySteps.length - 1 )
            {
                s += 'Finally, they ' + step.text + '. ';
            }
            else
            {
                sentenceIndex = Math.floor( Math.random() * sentenceStarts.length );
                s += sentenceStarts[ sentenceIndex ] + ' ' + step.text + '. ';

                s += this.extraStatements[ i ] + ' ';
            }
        } );

        return s;
    }

    genStory(numSteps)
    {
        this.itemList.resetItemLists();
        this.storySteps = [];

        for( let i = 0; i < numSteps; i++ )
        {
            this.genStoryStep();

        }

        let item = null;
        // add some extra items
        for( let i = 0; i < 3; i++ )
        {
            let numToAdd = Math.floor( Math.random() * 3 ) + 2;
            for( let j = 0; j < numToAdd; j++ )
            {
                switch( i )
                {
                    case 0:
                        item = this.itemList.getRandomLevelItem();
                        if (item !== null) this.levelItems.push( item );
                        break;
                    case 1:
                        item = this.itemList.getRandomInventoryItem();
                        if (item !== null) this.inventoryItems.push( item );
                        break;
                    case 2:
                        item = this.itemList.getRandomCharacter();
                        if (item !== null) this.characters.push( item );
                        break;
                }
            }
        }
    }

    genStoryStep()
    {
        let templateIndex = Math.floor( Math.random() * this.stepTemplates.length );
        let template = this.stepTemplates[ templateIndex ];

        let parts = template.split( ' ' );
        
        let stringParts = [];
        let items = [];
        let newItem = null;

        parts.forEach( ( p, i ) =>
        {
            if( p[ 0 ] == '@')
            {
                newItem = null;
                switch( p )
                {
                    case '@[item]':
                        newItem = this.itemList.getRandomInventoryItem();
                        this.inventoryItems.push( newItem );
                        break;
                    case '@[level]':
                        newItem = this.itemList.getRandomLevelItem();
                        this.levelItems.push( newItem );
                        break;
                    case '@[living]':
                        newItem = this.itemList.getRandomCharacter();
                        this.characters.push( newItem );
                        break;
                }
                if( newItem !== null )
                {
                    items.push( newItem );
                    stringParts.push( 'the ' + newItem.name );
                }
            }
            else
            {
                stringParts.push(p);
            }
        } );


        let newStep = new StoryStep( items );
        newStep.text = stringParts.join( ' ' );

        this.storySteps.push( newStep );

    }
}