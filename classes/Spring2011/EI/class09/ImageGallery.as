package
{
	import flash.display.MovieClip;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.display.Loader;
	import flash.display.*;
	
	public class ImageGallery extends MovieClip
	{
		private var image_load:URLLoader;
		private var image_info:XML;
		private var images:Array;

		private var data_loaded:Boolean;
		
		public function ImageGallery() 
		{
			// constructor code
			this.images = new Array();
			
			this.data_loaded = false;
			
			this.image_load = new URLLoader();
			
			this.image_load.addEventListener(Event.COMPLETE,loadData);
			this.image_load.load(new URLRequest('http://www.adrianherbez.net/classes/Spring2011/EI/class09/image_xml.php'));
			
		}
		
		public function loadData(e:Event)
		{
			this.image_info = new XML(e.target.data);
		
			var all_images = this.image_info.img;
			for (var i:int = 0; i<all_images.length(); i++)
			{
				trace(all_images[i].attribute('src'));
				/*
				var m = new MovieClip();
				m.loadMovie('http://www.adrianherbez.net/classes/Spring2011/EI/class09/' + all_images[i].attribute('src'));
				addChild(m);
				*/
				var url:String = 'http://www.adrianherbez.net/classes/Spring2011/EI/class09/' + all_images[i].attribute('src');
				var urlRequest:URLRequest = new URLRequest(url);
				var loader:Loader = new Loader();
				
				var xstart = (i % 4) * 100 + 5;
				var ystart = Math.floor(i/4) * 100 + 5;
				
				var rect:Shape = new Shape();
				rect.graphics.beginFill(0xFFFFFF);
				rect.graphics.drawRect(xstart, ystart, 90, 90);
				rect.graphics.endFill();
				loader.mask = rect;
		
				loader.load(urlRequest);
				loader.x = (i % 4) * 100;
				loader.y = Math.floor(i/4) * 100;
				
				addChild(loader);				
				/*
				var q = new QuakeIMG(quakes[i].long,quakes[i].lat,quakes[i].mag);
				addChild(q);
				
				this.quakes[i] = q;
				*/
			}
			
			this.data_loaded = true;
			trace('data loaded!');
			
		}
		
	}
	
	
}