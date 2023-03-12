package 
{
	import flash.display.MovieClip;
	import ImageUpload;
	
	public class class10 extends MovieClip
	{
		private var uploadInterface:ImageUpload;
		
		public function class10()
		{
			uploadInterface = new ImageUpload();
			addChild(uploadInterface);
			
		}
		
	}
}