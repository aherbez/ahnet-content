/*

class01.as
author: J. Adrian Herbez

This is an example base document class, which will create a number of square objects and update them each frame
in order to create a simple particle system. 

*/

package 
{
	import flash.display.MovieClip;
	import flash.events.Event;
	import square;
	import Dot;
	
	public class class01 extends MovieClip
	{
		private var s:square;
		private var squares:Array;
		
		public function class01()
		{			
			squares = new Array();
			
			for (var i=0;i<10;i++)
			{
				squares[i] = new square();
				this.addChild(squares[i]);
			}
			
			this.addEventListener(Event.ENTER_FRAME,updateSquares);
		}
		
		public function updateSquares(event:Event):void
		{
			for (var i=0;i<10;i++)
			{
				squares[i].moveMe();
			}		
		}
	}
}