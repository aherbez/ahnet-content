package 
{
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.text.*;
	import ImageGallery;
	
	public class ImageSearch extends MovieClip
	{
		private var searchButton:MovieClip;
		private var searchText:TextField;
		private var results:ImageGallery;
		
		public function ImageSearch()
		{
			searchText = new TextField();
			searchText.type = TextFieldType.INPUT;
			searchText.border = true;
			searchText.x = 10;
			searchText.y = 10;
			searchText.height = 20;
			searchText.width = 200;
			addChild(searchText)
		
			searchButton = new button();
			searchButton.x = 240;
			searchButton.y = 10;
			searchButton.button_text.text = 'Search Images';
			addChild(searchButton);	

			searchButton.addEventListener(MouseEvent.CLICK,searchImages);
		}
	
		function searchImages(evt:MouseEvent)
		{
			if (this.results != null)
			{
				trace('clearing images ' + this.results);
				this.results.destroy();
				//this.results = null;
			}
			trace(searchText.text);
			this.results = new ImageGallery(searchText.text);
			this.results.y = 50;
			addChild(this.results);
			
		}
	
	
	}
	
}