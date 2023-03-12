package
{
	import flash.display.MovieClip;
	import flash.display.LoaderInfo;
	import flash.text.TextField;
	
	public class class13 extends MovieClip
	{
		
		public function class13()
		{
			trace('init!');
			
			var paramObj:Object = LoaderInfo(this.root.loaderInfo).parameters;
			
			var ypos:int = 100;
			
			trace(paramObj);
			
			var myObj:Object = {x:20, y:30};
			/*
			for (var i:String in myObj) 
			{ 
				trace(i + ": " + myObj[i]);
				
				var t = new TextField();
				t.text = String(i);
				t.y = ypos;
				t.x = 100;
				addChild(t);
				
				ypos += 50;				
			} 
			*/
			
			for (var keyStr:String in paramObj) 
			{
				if (paramObj[keyStr] != null)
				{				
					// valueStr = String(paramObj[keyStr]);
				
					var t = new TextField();
					t.text = keyStr;
					t.y = ypos;
					t.x = 100;
					addChild(t);
					
					ypos += 50;
				}
			}
			
		}
	}
	
}