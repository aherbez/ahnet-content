package
{
	import GameObject;
	import Player;
	import Enemy
	import flash.events.Event;
	
	
	public class BigEnemy extends Enemy
	{
		public function BigEnemy(p:Player)
		{
			trace('making big enemy');
			super(p);
			this.mySpeed = 2;
			this.attack = 50;
			
			// make sure it starts away from the player
			this.x = 300;
			this.y = 300;
		}
		
		override protected function collideWithPlayer()
		{
			// super.collideWithPlayer();
			trace('BIG DUDE');
			
			if (this.playerInstance.isDead() == false) 
			{
				if (this.playerInstance.attack < 10)
				{
					this.playerInstance.damage(this.attack);
				}
				else
				{
					super.collideWithPlayer();
					Game.instance.WinGame();
				}
			}
		}
		
	}
	
}