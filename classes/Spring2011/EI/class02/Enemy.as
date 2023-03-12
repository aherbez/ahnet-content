package  
{
	import GameObject;
	import Player;
	import flash.events.Event;
	
	public class Enemy extends GameObject
	{
		
		protected var countFrame:int;
		protected var playerInstance:Player;

		public function Enemy(p:Player) 
		{
			trace(p);
			// constructor code
			this.mySpeed = 2;
			this.dir = 2;
			this.currState = STATE_ALIVE;
			this.x = Math.floor(Math.random()*400);
			this.y = Math.floor(Math.random()*400);
			
			this.countFrame = 0;
			
			this.playerInstance = p;
		}
		
		override public function destroy()
		{
			super.destroy();
		}
		
		override protected function updateMe(evt:Event):void
		{
			super.updateMe(evt);
			//trace('enemy update');
			
			if (this.currState == STATE_ALIVE)
			{
				this.countFrame -= 1;
				if (this.countFrame < 0)
				{
					this.countFrame = Math.floor(Math.random() * 10) + 3;
					this.dir = Math.floor(Math.random()*4) + 1;
				}
				
				if (this.hitTestObject(this.playerInstance))
				{
					collideWithPlayer();
				}
			}
		}
		
		protected function collideWithPlayer()
		{
			this.playerInstance.score();
			this.health = 0;
			//this.currState = STATE_DEAD;
		}
	}
	
}
