package 
{
	import Enemy;
	
	public class PowerUp extends Enemy
	{
		
		public function PowerUp(p:Player)
		{
			super(p);
			this.x = 20;
			this.y = 20;
			this.mySpeed = 0;
			this.dir = 0;
		}
		
		override protected function collideWithPlayer()
		{
			trace('upping player attack to 20!');
			this.playerInstance.attack = 20;
			
			// mark this for removal
			this.currState = STATE_DEAD;
		}
		
		// prevent powerups from taking damage
		override public function damage(amount:int):void
		{
			// do nothing
			
		}
		
		
	}
	
	
	
}