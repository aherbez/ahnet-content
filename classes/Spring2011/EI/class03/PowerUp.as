﻿package  {	import GameObject;		public class PowerUp extends Enemy	{		public function PowerUp(p:Player) 		{			// constructor code			super(p);			this.attack 	= 	0; 			this.mySpeed 	= 	0;						this.x = Math.random() * 400;			this.y = Math.random() * 400;		}	}	}