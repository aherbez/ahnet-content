<?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$sendInvURL = 'http://play-prod1-velcro-lb-1437125421.us-east-1.elb.amazonaws.com/send-inventory?channel_id=';
$channel_id = '678002454696034305'; // strval($_GET['channel_id']); // '678002454696034305';
$user_id = '&user_id=168586020797939713';

$content = file_get_contents($sendInvURL.$channel_id.$user_id);
echo $content;

?>