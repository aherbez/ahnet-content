/*
square.as
author: J. Adrian Herbez

This is a simple class, used by class01.as to create a simple particle system


*/

package
{
	import flash.display.MovieClip;
	
	public class square extends MovieClip
	{
		public var speed:Number;
		
		public function square()
		{
			//trace('new square!');
			this.speed = Math.floor(Math.random() * 5 + 5);
			
			// initialize the speed and position
			this.resetMe();
		}
		
		public function moveMe():void
		{
			// move the square down
			this.y += this.speed;
			
			// check to see if it needs to be reset
			if (this.y > 400)
			{
				this.resetMe();
			}
		}
		
		public function resetMe():void
		{
			// reset the speed
			this.speed = Math.floor(Math.random() * 5 + 5);
			
			// reset the position
			this.x = Math.floor(Math.random() * 400);	
			this.y = 0;
			
			// randomize the alpha
			this.alpha = Math.random();
		}
	}
	
}