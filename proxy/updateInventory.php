<?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$updateURL = 'http://play-prod1-velcro-lb-1437125421.us-east-1.elb.amazonaws.com/update-inventory?channel_id=';
$channel_id = '678002454696034305'; // strval($_GET['channel_id']); // '678002454696034305';
$user_id = '&user_id=168586020797939713';

$url = $updateURL.$channel_id.$user_id;

/*
{
  "player_inventory": {
    "max_level": 0,
    "score": 0,
    "collected": [0, 0, 0, 0, 0]
  }
}
*/

$data = array('score' => 100, 'max_level' => 9, 'collected' => [1,2,3,4,5]);

// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */ }

var_dump($result);


// echo($inv_string);

// $content = file_get_contents($customizationURL.$channel_id.$user_id);
// echo $content;

?>