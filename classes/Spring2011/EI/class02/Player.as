package
{
	import flash.display.MovieClip;
	import flash.events.KeyboardEvent;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
    import GameObject;
    
    
    public class Player extends GameObject
    {
        public function Player()
        {
            this.mySpeed	= 5;
            this.health 	= 100;
            this.attack 	= 5;
            this.dir 		= 0;
            
            this.x = 225;
            this.y = 200;

			addEventListener(Event.ADDED_TO_STAGE,init);
			
			trace('player created');
        }
		
		private function init(evt:Event):void
		{
            stage.addEventListener(KeyboardEvent.KEY_DOWN,changeDirection);
            stage.addEventListener(KeyboardEvent.KEY_UP,stopMe);
		}
     			
		override public function damage(amount:int):void
		{
			super.damage(amount);
			trace('Just took ' + amount + ' points of damage!');
		}
		
        public function stopMe(evt:KeyboardEvent):void
        {
            this.dir = 0;
        }
        
        public function changeDirection(evt:KeyboardEvent):void
        {
            switch (evt.keyCode)
            {
                case Keyboard.UP:
                    this.dir = 1;
                    break;
                case Keyboard.RIGHT:
                    this.dir = 2;
                    break;
                case Keyboard.DOWN:
                    this.dir = 3;
                    break;
                case Keyboard.LEFT:
                    this.dir = 4;
                    break;
            }
        }
		
		public function score()
		{
			trace('woot!');
		}
		
		override public function destroy()
		{
			Game.instance.LoseGame();
			super.destroy();
		}
    }
}