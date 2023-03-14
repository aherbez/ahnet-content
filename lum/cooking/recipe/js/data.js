// steps
const makeARoux = {
    items: [ 1, 2 ],
}

const chopOnion = {
    items: [20, 3]
}

const cookChoppedOnion = {
    items: [21, 16]
}

const putOnionInPot = {
    items: [ 17, 27 ],
    type: 1,
    gathering_tool: 17,
    phase: 2
}

const onionProcess = {
    main: 1,
    steps: [
        chopOnion,
        cookChoppedOnion,
        putOnionInPot
    ]
}

const celeryProcess = {
    main: 1,
    steps: [
        {
            items: [5, 20]
        },
        {
            items: [23, 16]
        },
        {
            items: [17, 29],
            type: 1,
            gathering_tool: 17,
            phase: 2
        }
    ]
}

const pepperProcess = {
    main: 1,
    steps: [
        {
            items: [ 4, 20 ]
        },
        {
            items: [ 22, 16 ]
        },
        {
            items: [ 17, 28 ],
            type: 1,
            gathering_tool: 17,
            phase: 2
        }
    ]
}

const tomatoProcess = {
    steps: [
        {
            items: [12, 20]
        },
        {
            items: [ 25, 17 ],
            gathering_tool: 17,
            type: 1,
            phase: 2
        }
    ]
}

const mainProcess = {
    steps: [
        makeARoux,
        {
            items: [ 33, 17 ],
            gathering_tool: 17,
            phase: 2,
            type: 1
        },
        {
            items: [17, 34],
            gathering_tool: 34,
            phase: 3,
            type: 1
        }
    ],
    main: 1
}

const riceProcess = {
    steps: [
        {
            items: [35, 36]
        },
        {
            items: [ 37, 34 ],
            gathering_tool: 34,
            phase: 3,
            type: 1
        }
    ]
}

const gumbo = {
    main: mainProcess,
    processes: [
        onionProcess,
        celeryProcess,
        pepperProcess,
        tomatoProcess,
        riceProcess
    ]
};

/*

backbone: 
    main process. 
    contains gathering steps
    ends with completed dish

other processes:
    list of steps
    end result is a tagged step in backbone process

step:
    combination of items
    two types:
        standard - combines two things
        gathering - combines N things, has tag
*/


const items = {
    1: 'flour',
    2: 'oil',
    3: 'onion',
    4: 'green pepper',
    5: 'celery',
    6: 'shrimp',
    7: 'sausage',
    8: 'chicken',
    9: 'salt',
    10: 'pepper',
    11: 'bay leaf',
    12: 'tomatoes',
    13: 'chicken broth',
    14: 'green onion',
    15: 'rice',
    16: 'saucepan',
    17: 'pot',
    18: 'bowl',
    19: 'okra',
    20: 'knife',
    21: 'chopped onion',
    22: 'chopped pepper',
    23: 'chopped celery',
    24: 'chopped sausage',
    25: 'chopped tomatoes',
    26: 'chopped okra',
    27: 'cooked onion',
    28: 'cooked pepper',
    29: 'cooked celery',
    30: 'cooked sausage',
    31: 'cooked tomatoes',
    32: 'cooked okra',
    33: 'roux',
    34: 'bowl',
    35: 'rice',
    36: 'rice cooker',
    37: 'cooked rice'
};
