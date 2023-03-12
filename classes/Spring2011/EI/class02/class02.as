package
{
    import flash.display.MovieClip;
    import flash.events.Event;
	import Player;
	import Enemy;
	import BigEnemy;
	import Game;
    
    public class class02 extends MovieClip
    {
        private var thePlayer:Player;
        private var e1:BigEnemy;
		private var enemies:Array;
		private var armor:PowerUp;
		private var theGame:Game;
		
        public function class02()
        {
			theGame = new Game();
			
            thePlayer = new Player();
			addChild(thePlayer);
			
			e1 = new BigEnemy(thePlayer);
			addChild(e1);
			
			armor = new PowerUp(thePlayer);
			addChild(armor);
			
			trace('normals');
			enemies = new Array();
			
			for (var i=0;i<5;i++)
			{
				enemies[i] = new Enemy(thePlayer);
				addChild(enemies[i]);
			}
			
        }
		
		public static function foo():void
		{
			trace('FOO!!!');
		}
		
		/*
		public function removeDead(evt:Event):void
		{
			for (var i=0;i<5;i++)
			{
				if (enemies[i].isDead())
				{
					enemies[i].destroy();
					removeChild(enemies[i]);
				}
			}
		}
		*/
    }
}