<?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$customizationURL = 'http://play-prod1-velcro-lb-1437125421.us-east-1.elb.amazonaws.com/customization?channel_id=';
$channel_id = '678002454696034305'; // strval($_GET['channel_id']); // '678002454696034305';



$content = file_get_contents($customizationURL.$channel_id);
echo $content;

?>