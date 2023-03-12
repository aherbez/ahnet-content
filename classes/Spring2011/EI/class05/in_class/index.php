<?php 

require_once('Place.php');
require_once('CSVReader.php');

$url = 'http://earthquake.usgs.gov/earthquakes/catalogs/eqs1hour-M1.txt';
$url = 'http://earthquake.usgs.gov/earthquakes/catalogs/eqs7day-M2.5.txt';
$test = new CSVReader($url);
$test->printXML();
?>


