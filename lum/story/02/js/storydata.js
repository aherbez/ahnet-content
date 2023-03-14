let story = {
    "sections": [
        {
            "textOld": {
                "left": "The feast was nearly ready: the meat was grilled, the beans were baked and the cole was slawed. The only thing left to make was the BBQ sauce",
                "right": "She *used her knife to dice the tomatoes.* Then she *chopped the garlic.* Then came the piece de resistance: her secret spice packets. She *walked to the spice jar,* but found it empty. Where could they have gone?"
            },
            "text": {
                "left": "The meat was grilled, the beans were baked, and the cole was slawed. It was 5 minutes until the grand opening and Lisa still hadn\'t chopped the ingredients for the barbecue sauce. ",
                "right": "Lisa used her *knife to dice the tomatoes.* Then she *chopped the garlic.* Next was the piece de resistance: her secret spice packets. She *walked to the spice jar,* but found it empty. Where could they have gone?"
            },
            "background": "img/background01_2.png",
            "inventory": [3, 4],
            "items": [ [ 5, 67, 275 ], [ 6, 67, 185 ], [ 8, 270, 134 ], [ 7, 390, 150 ],
                [ 9, 515, 133 ], [ 10, 560, 264 ], [ 21, 202, 210 ]
            ],
            "playerStart": [350, 292],
            "steps": [
                {
                    "summary": "[[use knife on tomato]] remove tomato, add chopped tomato to inventroy, remove eyes from mouse hole, mouse appears next to secret ingredient jar",
                    "items": [4, 5],
                    "result": [
                        {
                            "type": "remove",
                            "data": [5]
                        },
                        {
                            "type": "add_inv",
                            "data": [19]
                        },
                        {
                            "type": "remove",
                            "data": [21]
                        },
                        {
                            "type": "add",
                            "data": [1, 525, 288]
                        }
                    ]
                },
                {
                    "summary": "[[use knife on garlic]] remove garlic, add chopped garlic to inventory, remove mouse, replace secret ingredient jar with empty jar",
                    "items": [4, 9],
                    "result": [
                        {
                            "type": "remove",
                            "data": [9]
                        },
                        {
                            "type": "add_inv",
                            "data": [20]
                        },
                        {
                            "type": "remove",
                            "data": [1]
                        },

                    ]

                },
                {
                    "summary": "[[go to secret ingredient jar]] end scene",
                    "items": [10],
                    "result": [
                        {
                            "type": "replace",
                            "data": [ 10, 11 ]
                        },
                        {
                            "type": "end_scene"
                        }
                    ]
                }
            ]
        },
        {
            "textOld": {
                "left": "List *rifled through her jacket pockets.* No spice there. \n Maybe the packets fell out in transite? She *checked the storage container* she brouhgt to the event. Spiceless. \n Still, she could smell it. It was here. Somewhere in the closet.",
                "right": "Just then, a tiny noise came from the corner. She *flipped the bucket* over to reveal a mouse clutching the torn packet of the special spices, its fuzzy little face covered in the ruddy mixture. It sneezed and looked up at Lisa in terror. \n It was't pretty, but Lisa knew what she had to do. She *brandished her knife at the tiny creature.*"
            },
            "text": {
                "left": "Lisa *rifled through her jacket pockets.* No spice there. Maybe the packets fell out in transit? She *checked the storage container* she brought to the event.Empty.",
                "right": "Just then, a tiny noise came from the corner. Lisa *flipped the bucket over* to reveal a mouse clutching the torn packet of spice, its fuzzy face covered in the ruddy mixture. It sneezed and looked up at Lisa. Lisa knew what she had to do: she *extended her knife towards the tiny creature.*",
            },
            "background": "img/background02.png",
            "inventory": [20, 19, 3, 4],
            "items": [ [ 23, 78, 318 ], [ 16, 146, 192 ], [ 17, 247, 200 ], [ 13, 462, 177 ],
                [ 12, 539, 185 ], [ 15, 555, 309 ] ],
            "playerStart": [ 350, 292 ],
            "steps": [
                {
                    "summary": "[[go to coat rack]]",
                    "items": [15],
                    "result": []
                },
                {
                    "summary": "[[go to box]] remove box",
                    "items": [12],
                    "result": [
                        {
                            "type": "remove",
                            "data": [12]
                        }
                    ]

                },
                {
                    "summary": "[[go to bucket]] remove bucket, replace with mouse",
                    "items": [16],
                    "result": [
                        {
                            "type": "replace",
                            "data": [16, 1]
                        }
                    ]
                },
                {
                    "summary": "[[use knife on mouse",
                    "items": [1, 4],
                    "result": [
                        {
                            "type": "end_scene"
                        }
                    ]
                }
            ]
        },
        {
            "text": {
                "left": "\"Excuse me, Mr. Mouse. Can you cook? I\'m short-handed tonight!\" The mouse took the Chef\'s knife, donned a chef\'s hat, and got to work. Lisa *added the chopped tomatoes to the pot.* Then she *added the garlic.* Mr.Mouse added chopped onions and the rest of the spices.",
                "right": "Then Lisa *took the pot* and went to the dining room. She *poured the pot on the barbecued meats.* Customers poured in and devoured the delicious food.\"It\'s so good,\" one remarked. \"I want a picture with the chef!\" Lisa *picked up Mr.Mouse* and posed. \"What\'s your secret ingredient?\" \"Teamwork,\" Lisa replied.",
            },
            "background": "img/background01_2.png",
            "inventory": [ 20, 19, 3 ],
            "items": [ [ 6, 67, 185 ], [ 8, 270, 134 ],
                [ 10, 560, 264 ], [ 21, 202, 210 ], [18, 340, 145], [24, 65, 281], [2, 313, 347]
            ],      
            "playerStart": [ 350, 292 ],
            "steps": [
                {
                    "summary": "[[use chopped tomatoes on pot]] rat moves to the onion, remove onion",
                    "items": [19, 18],
                    "result": [
                        {
                            "type": "remove",
                            "data": [19]
                        },
                        {
                            "type": "animate",
                            "data": [ 2, 119, 299, {
                                "type": "remove",
                                "data": [24]
                            }]
                        },
                    ]
                },
                {
                    "summary": "[use chopped garlic on pot]] rat comes over to pot",
                    "items": [20, 18],
                    "result": [
                        {
                            "type": "remove",
                            "data": [20]
                        },
                        {
                            "type": "animate",
                            "data": [2, 298, 234]
                        }
                    ]
                },
                {
                    "summary": "[[go to pot]] remove pot from scene, add to inventory",
                    "items": [18],
                    "result": [
                        {
                            "type": "remove",
                            "data": [18]
                        },
                        {
                            "type": "add_inv",
                            "data": [18]
                        },
                        {
                            "type": "change_scene",
                            "data": [
                                "img/background04.png",
                                [[7, 335, 127],[2,51,171]],
                                [ 3, 18 ],
                                [493, 272]
                            ]
                        }
                    ]
                },
                {
                    "summary": "[[use pot on meat]] remove pot from inventory, add people to scene",
                    "items": [18, 7],
                    "result": [
                        {
                            "type": "remove",
                            "data": [18]
                        },
                        {
                            "type": "replace",
                            "data": [7, 14]
                        },
                        {
                            "type": "add",
                            "data": [25, 140, -150]
                        },
                        {
                            "type": "add",
                            "data": [ 26, 203, -150 ]
                        },
                        {
                            "type": "add",
                            "data": [ 27, 470, -150 ]
                        },
                        {
                            "type": "add",
                            "data": [ 28, 547, -150 ]
                        },
                        {
                            "type": "animate",
                            "data": [ 25, 140, 262]
                        },
                        {
                            "type": "animate",
                            "data": [ 26, 203, 122 ]
                        },
                        {
                            "type": "animate",
                            "data": [ 27, 470, 122 ]
                        },
                        {
                            "type": "animate",
                            "data": [ 28, 547, 262 ]
                        },
                    ]
                },
                {
                    "summary": "[[go to mouse]]",
                    "items": [2],
                    "result": [
                        {
                            "type": "end_scene"
                        }
                    ]

                }
            ]
        }
    ]
};