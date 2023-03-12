package 
{
	import flash.display.MovieClip;
	import ImageUpload;
	
	public class class09 extends MovieClip
	{
		private var uploadInterface:ImageUpload;
		
		public function class09()
		{
			uploadInterface = new ImageUpload();
			addChild(uploadInterface);
			
		}
		
	}
}