package
{
    import flash.display.MovieClip;
	import flash.events.KeyboardEvent;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
    
    public class GameObject extends MovieClip
    {
        // define constants
        protected static const STATE_ALIVE:int  = 0;
        protected static const STATE_DEAD:int   = 1;      
        protected static const MARGIN:int   = 30;
        
        // define class variables
        public var attack:Number;
 
		protected var health:Number;
        protected var mySpeed:Number;        
        protected var dir:int;
        protected var currState:int;
        
        public function GameObject()
        {
            this.currState = STATE_ALIVE;
            
            this.addEventListener(Event.ENTER_FRAME,updateMe);
			
        }
        
        // destructor: perform any necessary cleanup here
        public function destroy()
        {
            this.removeEventListener(Event.ENTER_FRAME,updateMe)
        }
        
		public function isDead():Boolean
		{
			if (this.currState == STATE_DEAD)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		
		public function damage(amount:int):void
		{
			this.health -= amount;
		}
		
        protected function updateMe(evt:Event):void
        {
			// trace('update: ' + this.dir);
            if (this.currState == STATE_ALIVE)
            {
                switch (this.dir)
                {
                    case 0:
                        break;
                    case 1:
                        // move up
                        this.y = this.y - this.mySpeed;
                        break;
                    case 2:
                        // move right
                        this.x = this.x + this.mySpeed;
                        break;
                    case 3:
                        // move down
                        this.y = this.y + this.mySpeed;
                        break;
                    case 4:
                        // move left
                        this.x = this.x - this.mySpeed;
                        break;
                }
                
                // stop if we've hit a wall
                if (this.x < MARGIN || this.x > 500-MARGIN)
                {
                    this.dir = 0;
                }
                if (this.y < MARGIN || this.y > 400-MARGIN)
                {
                    this.dir = 0;
                }
                
                // mark this object for removal                
                if (this.health <= 0)
                {
                    this.currState = STATE_DEAD;
                }
            }
			else
			{
				// send message to remove this from the stage
				destroy();
				this.parent.removeChild(this);
			}
        }
    }

}