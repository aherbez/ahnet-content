package 
{
	import flash.display.MovieClip;
	import flash.net.FileReference;
	import flash.net.FileFilter;
	import flash.events.*;
	import flash.events.MouseEvent;
	import flash.net.URLRequest;
	import flash.net.URLVariables;
	import flash.net.URLRequestMethod;
	import flash.text.*;
	
	public class ImageUpload extends MovieClip
	{
		private var fileRef:FileReference;
		private var progBar:progress_mc;
		private var fileTypes:Array;
		private var tagList:TextField;
		private var tagLabel:TextField;
		private var fileName:TextField;
		private var uploadButton:button;
		private var browseButton:button;
		
		public function ImageUpload()
		{

			// create browse button
			browseButton = new button();
			browseButton.x = 10;
			browseButton.y = 10;
			browseButton.button_text.text = 'BROWSE';
			addChild(browseButton);
			
			tagLabel = new TextField();
			tagLabel.text = 'Tags: ';
			tagLabel.x = 10;
			tagLabel.y = 40;
			addChild(tagLabel);
			
			tagList = new TextField();
			tagList.type = TextFieldType.INPUT;
			tagList.border = true;
			tagList.x = 50;
			tagList.y = 40;
			tagList.height = 20;
			tagList.width = 200;
			addChild(tagList)
			
			fileName = new TextField();
			fileName.x = 150;
			fileName.y = 10;
			fileName.text = 'Filename';
			addChild(fileName);

			uploadButton = new button();
			uploadButton.x = 10;
			uploadButton.y = 65;
			uploadButton.width = 200;
			uploadButton.button_text.text = 'UPLOAD';
			addChild(uploadButton);
			
			browseButton.addEventListener(MouseEvent.CLICK,onBrowse);
			uploadButton.addEventListener(MouseEvent.CLICK,upload);

			fileTypes = new Array(new FileFilter( "Images (*.jpg, *.jpeg,)", "*.jpg;*.jpeg;" ));
			
			fileRef = new FileReference(); 
			fileRef.addEventListener(Event.SELECT,setImage);
			fileRef.addEventListener(Event.CANCEL,cancel);
			fileRef.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA,uploadComplete);
			fileRef.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
			fileRef.addEventListener(ProgressEvent.PROGRESS, progressHandler);						
			
		}
		
		public function securityErrorHandler()
		{
			trace('security error');
			
		}
		public function uploadComplete(evt:DataEvent)
		{
			trace('upload complete!');
			fileName.text = 'Upload complete!';
		}
		
		public function onBrowse(evt:Event)
		{
			fileRef.browse(fileTypes);
		}
		
		public function setImage(e:Event)
		{
			trace('image selected');
			var selectedFile = FileReference(e.target);
			fileName.text = selectedFile.name;
		}
		
		public function upload(e:Event)
		{
			var url = new URLRequest('http://www.adrianherbez.net/classes/Spring2011/EI/class10/insert_image.php');
			
			var postVars:URLVariables = new URLVariables();
			postVars.tags = tagList.text; 
			url.method = URLRequestMethod.POST;
			url.data = postVars;

			fileRef.upload(url);	
		}
		
		public function cancel(evt:Event)
		{
			trace('canceled');
		}

		// Function that fires off when the upload progress begins
		function progressHandler(event:ProgressEvent):void 
		{
			//progBar.width = Math.ceil(200*(event.bytesLoaded/event.bytesTotal));
			trace(event.bytesLoaded/event.bytesTotal);
			if (event.bytesLoaded == event.bytesTotal)
			{
				fileName.text = 'file uploaded!';
			}
		}		
	}
}