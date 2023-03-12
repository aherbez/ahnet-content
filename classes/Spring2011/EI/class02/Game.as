package
{
	
	public class Game 
	{
		private static var _instance:Game;
		
		
		public function Game()
		{
			_instance = this;
		}

		public static function get instance():Game
		{
			return _instance;
		}
		
		public function LoseGame()
		{
			trace('GAME OVER MAN!');
		}
		
		public function WinGame()
		{
			trace('YOU WON!');
		}
		
	}
	
}