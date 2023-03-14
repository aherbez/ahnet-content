/*
Starfield.as

Implements the starfield. Creates a number of Star objects, 
and draws them to the stage using double buffering.


*/

package
{
	import flash.display.MovieClip;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import flash.events.Event;
	import Tracker;
	import Star;
	
	public class Starfield extends MovieClip
	{
		private var starlist:Array;
		private var num_stars:int;
		private var bm:Bitmap;
		
		private var buffers:Array;
		private var curr_buff:int;
		
		private var track:Tracker;
		
		public function Starfield(num:int)
		{
			// create two buffers
			buffers = new Array();
			buffers[0] = new BitmapData(640,480,false,0x000000);
			buffers[1] = new BitmapData(640,480,false,0x000000);
			
			// create the bitmap
			bm = new Bitmap(buffers[0]);
			
			curr_buff = 0;
			
			num_stars = num;
			
			starlist = new Array();			
			addStars();

			addChild(bm);
			
			track = new Tracker(num);
			addChild(track);

			addEventListener(Event.ENTER_FRAME,updateStars);
		}
		
		/*
		add a group of stars at a time to reduce clumping at the start
		*/
		private function addStars()
		{
			for (var i:int = 0; i<100; i++)
			{
				starlist.push(new Star());
			}
		}
		
		public function alterCount(amt:int)
		{
			num_stars += amt;
			if (starlist.length > num_stars)
			{
				starlist.splice(num_stars,(starlist.length-num_stars));
			}
			track.updateCounts(starlist.length,num_stars);			
		}
		
		private function updateStars(evt:Event)
		{

			if (starlist.length < num_stars)
			{
				addStars();
				track.updateCounts(starlist.length,num_stars);
			}
			
			var color:uint = 0;
			var s:Star;
			buffers[curr_buff].fillRect(new Rectangle(0,0,640,480),0x000000);
			for (var i=0; i<starlist.length; i++)
			{
				s = starlist[i];				
				s.updatePos();
				color = (s.m<<16) + (s.m<<8) + (s.m);
				buffers[curr_buff].setPixel(s.p.x +320,s.p.y+240,color);
			}
			
			// draw a black rectangle at the top left to make the stats easier to read
			buffers[curr_buff].fillRect(new Rectangle(0,0,100,50),0x000000);
			
			// flip buffers
			bm.bitmapData = buffers[curr_buff];
			curr_buff = (curr_buff + 1) % 2;
			
		}
	}
}