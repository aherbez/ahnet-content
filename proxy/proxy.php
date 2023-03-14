<?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$customizationURL = 'http://play-prod1-velcro-lb-1437125421.us-east-1.elb.amazonaws.com/customization?channel_id=';
$channel_id = '678002454696034305';

/*
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
*/

$content = file_get_contents($customizationURL.$channel_id);
echo $content;

?>