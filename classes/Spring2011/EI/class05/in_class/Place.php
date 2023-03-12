<?php

class Place
{
	protected $lat;
	protected $lon;
	
	protected $x;
	protected $y;
	
	public function __construct($longIn = 0,$latIn = 0)
	{
		$this->lat = $latIn;
		$this->lon = $longIn;
		
		$this->x = ($this->lon + 180) / 360;
		$this->y = ($this->lat - 90) / -180;
	}
}

class Quake extends Place
{
	private $mag;
	
	public function __construct($longIn = 0,$latIn = 0,$magnitudeIn = 0)
	{
		parent::__construct($longIn,$latIn);
		$this->mag = $magnitudeIn;
	}
	
	
	public function printMe()
	{
		echo('Quake: ' . $this->lat . ' ' . $this->lon);
		echo(' ' . $this->x . ' ' . $this->y);
		echo(' ' . $this->mag . '<br />');
	}
	
	public function printXML()
	{
		echo('<quake>');
		echo('<long>' . $this->x . '</long>');
		echo('<lat>' . $this->y . '</lat>');
		echo('<mag>' . $this->mag . '</mag>');
		echo('</quake>');
	}
	
}


?>



