package
{
	import flash.geom.Point;
	
	public class Star
	{
		private var heading:Number;
		//private var heading:int;
		private var speed:Number;
		public var m:int;
		public var p:Point;
		
		// static var lookup:Array;
		
		public function Star()
		{
			/*
			if (lookup == null)
			{
				createLookup();
			}
			*/
			p = new Point(0,0);
			reset();
		}
		
		/*
		private function createLookup()
		{
			trace('creating lookup');
			lookup = new Array();
			for (var i=0;i<360;i++)
			{
				lookup[i] = Math.cos(i/360 * Math.PI * 2);
			}
		}
		*/
		
		public function updatePos()
		{
			p.x += Math.cos(heading) ;
			p.y += Math.sin(heading) ;
			/*
			p.x += lookup[heading];
			p.y += lookup[(heading+90)%360];			
			*/
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
			// heading = Math.random() * 360;
			p.x = Math.cos(heading) ;
			p.y = Math.sin(heading) ;
			/*
			p.x = lookup[heading];
			p.y = lookup[(heading+90)%360];
			*/
		}
		
	}
	
	
}