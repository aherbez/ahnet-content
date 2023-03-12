<?php

require_once('QuakeCSV.php');

$csv = 'http://earthquake.usgs.gov/earthquakes/catalogs/eqs1hour-M0.txt';

$csv = 'http://earthquake.usgs.gov/earthquakes/catalogs/eqs1day-M0.txt';
$c = new QuakeCSV($csv);
$c->printXML();

?>