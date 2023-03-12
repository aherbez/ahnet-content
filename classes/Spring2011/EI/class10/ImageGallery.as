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
		private const BASE_URL:String = 'http://www.adrianherbez.net/classes/Spring2011/EI/class10/image_search_xml.php?search=';
		
		public function ImageGallery(searchTerm) 
		{
			// constructor code
			this.images = new Array();
			
			this.data_loaded = false;
			this.image_load = new URLLoader();
			this.image_load.addEventListener(Event.COMPLETE,loadData);
			this.image_load.load(new URLRequest(BASE_URL + searchTerm));
			
		}
		
		public function destroy()
		{
			for (var i:int=0; i< images.length; i++)
			{
				removeChild(this.images[i]);
				this.images[i] = null;
			}
		}
		
		public function loadData(e:Event)
		{
			this.image_info = new XML(e.target.data);
		
			var all_images = this.image_info.img;
			for (var i:int = 0; i<all_images.length(); i++)
			{
				trace(all_images[i].attribute('src'));

				var url:String = 'http://www.adrianherbez.net/classes/Spring2011/EI/class10/' + all_images[i].attribute('src');
				var urlRequest:URLRequest = new URLRequest(url);
				var loader:Loader = new Loader();
				
				var xstart = (i % 4) * 100 + 5;
				var ystart = Math.floor(i/4) * 100 + 5;
				
				loader.contentLoaderInfo.addEventListener(Event.COMPLETE, scaleImage);
				loader.load(urlRequest);
				loader.x = (i % 4) * 100;
				loader.y = Math.floor(i/4) * 100;
				
				addChild(loader);
				this.images[i] = loader;
			}
			
			this.data_loaded = true;
			trace('data loaded!');
			
		}
		
		public function scaleImage(evt:Event)
		{
			trace('scaling image ' + evt.target.width + ' ' + evt.target.height);
		
			var xratio = 100 / evt.target.width;
			var yratio = 100 / evt.target.height;
			
			var scale_ratio = yratio;
			
			if (xratio < yratio)
			{
				scale_ratio = xratio;
			}
			
			evt.target.content.scaleX = scale_ratio;
			evt.target.content.scaleY = scale_ratio;
		
		}

		
	}
	
	
}