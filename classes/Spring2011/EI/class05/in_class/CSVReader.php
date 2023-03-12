<?php

require_once('Place.php');

class CSVReader
{
	protected $url;
	protected $data;
	
	public function __construct($urlToLoad)
	{
		$this->url = $urlToLoad;
		$this->data = array();
		
		$this->loadCSV();
	}
	
	public function loadCSV()
	{
		$handle = fopen($this->url,'r');
		
		$lat = NULL;
		$lon = NULL;
		$mag = NULL;
		$q	= NULL;
		
		
		while (($data = fgetcsv($handle)) !== FALSE)
		{
			// read a line of the file		
			// print_r($data);
			// echo('<br />');
			$lat = $data[4];
			$lon = $data[5];
			$mag = $data[6];
			
			$q = new Quake($lon,$lat,$mag);
			array_push($this->data,$q);
		}
		fclose($handle);	
	
	}
	
	public function printXML()
	{
		echo('<xml>');
		for ($i=1; $i<count($this->data); $i++)
		{
			$this->data[$i]->printXML();
		}
		echo('</xml>');
	
	}

}



?>