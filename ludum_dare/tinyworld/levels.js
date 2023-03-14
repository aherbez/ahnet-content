/*
 var TYPE_DIRT   = 0;
var TYPE_WATER  = 1;
var TYPE_ROCK   = 2;
var TYPE_GAS    = 3;
*/

var text_intro = ['Welcome to SpaceCorp- The best',
                  'small-to-medium size planet builders',
                  'in the galaxy.',
                  '',
                  'Your Super Gravity Sphere will attract',
                  'matter from the far-flung reaches of',
                  'space.',
                  '',
                  'Use what it finds to build planets to',
                  'meet our customers\' needs',
                  '',
                  'Controls:',
                  '  Left/Right arrow keys: rotate planet',
                  '  W: activate shield (to reject matter)',
                  '',
                  '      [W] to start'];

var levels = new Array();

var l = new Object();
l.prob = [0.25,0.25,0.25,0.25];
l.size = 10;
l.startSize = 8;
l.crit = [];
l.startText = ['LEVEL 1',
               '',
               'For this, we just need a small world',
               '',
               'Anything will do- just use whatever',
               'comes your way',
               '',
               'REQUIREMENTS:',
               '   PLANET SIZE: 10',
               '',
               '',
               '      [W] to start'];

levels[0] = l;

l = new Object();
l.prob = [0.4,0.4,0.1,0.1];
l.size = 10;
l.startSize = 8;
l.crit = [{c:'gte',v:0.5,t:1}];
l.startText = ['LEVEL 2',
                'For this, we still need a small world,',
                'but it needs to be mainly water.',
                '',
                'REQUIREMENTS:',
                '   PLANET SIZE: 10',
                '   >= 50% water',
                '',
               '',
               '      [W] to start'];

levels[1] = l;

l = new Object();
l.prob = [0.1,0.3,0.3,0.3];
l.size = 20;
l.startSize = 8;
l.crit = [{c:'gte',v:0.2,t:1},{c:'gte',v:0.2,t:2},{c:'gte',v:0.2,t:3}];
l.startText = ['LEVEL 3',
                'For this, need a larger world,',
                'and it should be rougly evenly',
                'composed of rock, water, and O2.',
                '',
                'REQUIREMENTS:',
                '   PLANET SIZE: 20',
                '   >= 20% rock',
                '   >= 20% water',
                '   >= 20% oxygen',
                '',
               '',
               '      [W] to start'];

levels[2] = l;

l = new Object();
l.prob = [0.25,0.25,0.25,0.25];
l.size = 20;
l.startSize = 8;
l.crit = [{c:'lte',v:0.1,t:1}];
l.startText = ['LEVEL 4',
                'For this, need a larger world,',
                'but it needs to have very little',
                'water.',
                '',
                'REQUIREMENTS:',
                '   PLANET SIZE: 20',
                '   <= 10% water',
                '',
                '',
                '',
               '',
               '      [W] to start'];

levels[3] = l;
