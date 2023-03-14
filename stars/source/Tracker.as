/*
Tracker.as

Implements a simple stat tracker to display:
	- the current frames per second
	- the number of stars being rendered
	- the target number of stars
*/

package 
{
	import flash.display.MovieClip;
	import flash.text.TextField;
	import flash.events.Event;
	import flash.utils.getTimer;
	import flash.external.ExternalInterface;
	
	public class Tracker extends MovieClip
	{
		private var stats:TextField;
		private var frames:int;
		private var timer:int = getTimer();
		private var fps:int;
		private var numstars:int;
		private var currstars:int;
		
		public function Tracker(num:int)
		{
			numstars = num;
			stats = new TextField();
			stats.textColor = 0xFFFFFF;
			addChild(stats);
			
			frames = 0;
			fps = 0;
			currstars = 0;
			
			stats.text = 'Hello from tracker! ' + timer;
			
			addEventListener(Event.ENTER_FRAME,updateStats);
		}
		
		public function updateCounts(curr:int,target:int)
		{
			currstars = curr;
			numstars = target;
		}
		
		private function updateStats(evt:Event):void
		{
			frames++;
			
			var now = getTimer();
			if ((now-timer) >= 1000)
			{
				timer = now;
				fps = frames;
				frames = 0;
				stats.text = fps + ' FPS \nStars: ' + currstars + '/' + numstars + '\n(current/target)';
			}
		
		}
		
	}
}