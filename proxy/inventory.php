<?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$customizationURL = 'http://play-prod1-velcro-lb-1437125421.us-east-1.elb.amazonaws.com/inventory?channel_id=';
$channel_id = '678002454696034305'; // strval($_GET['channel_id']); // '678002454696034305';
$user_id = '&user_id=168586020797939713';

$inv_string = '{"player_inventory": {"max_level": 0,"score": 0,"collected": [0, 0, 0, 0, 0]}}';

echo($inv_string);

// $content = file_get_contents($customizationURL.$channel_id.$user_id);
// echo $content;

?>