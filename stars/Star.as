/*
Star.as

Holds the position and heading of a given star. Not responsible for drawing, 
but it does handle the updating of position data. 

*/

package
{
	import flash.geom.Point;
	
	public class Star
	{
		private var heading:Number;
		private var speed:Number;
		public var m:int;
		public var p:Point;
				
		public function Star()
		{

			p = new Point(0,0);
			reset();
		}
		
		public function updatePos()
		{
			p.x += Math.cos(heading) ;
			p.y += Math.sin(heading) ;
			if (m < 255)
			{
				m += 1;
			}
			
			if (p.x > 320 || p.x < -320 || p.y < -240 || p.y > 240)
			{
				reset();
			}
		}
		
		private function reset()
		{
			m = 0;
			heading = Math.random() * Math.PI * 2;
			p.x = Math.cos(heading) ;
			p.y = Math.sin(heading) ;
		}
		
	}
	
	
}