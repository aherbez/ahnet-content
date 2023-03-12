package
{
	import flash.display.MovieClip;
	
	public class Dot 
	{
		// class variables
		public var hello:String = "Hello";
		private var myName:String;
		
		// constructor
		public function Dot(n:String)
		{
			myName = n;
			trace('new dot!');
		}
		
		public function sayHi():void
		{
			trace(hello + ' ' + myName);
		}
		
		public function getName():String
		{
			return this.myName;
		}
	}
	
}