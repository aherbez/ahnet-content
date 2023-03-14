/*

StarfieldDoc.as

Main document class. Creates a Starfield object nad sets up an event listener for keyboard events.

*/

package
{
	import flash.display.MovieClip;
	import flash.events.KeyboardEvent;
	import Starfield;
	
	public class StarfieldDoc extends MovieClip
	{
		private var stars:Starfield;
		
		public function StarfieldDoc()
		{
			stars = new Starfield(30000);
			addChild(stars);
			
			stage.addEventListener(KeyboardEvent.KEY_DOWN,handleKey);
		}
		
		public function handleKey(evt:KeyboardEvent)
		{
			switch (evt.keyCode)
			{
				case 38:
					stars.alterCount(100);
					break;
				case 40:
					stars.alterCount(-100);
					break;
				case 37:
					stars.alterCount(-500);
					break;
				case 39:
					stars.alterCount(500);
					break;
				default:
					break;
			}
		}
		
	}
}