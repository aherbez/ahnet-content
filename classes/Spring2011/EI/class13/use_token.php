<?php

require_once('facebook.php');

echo('<pre>');
print_r($_REQUEST);
echo('</pre>');

if (!empty($_REQUEST['token']))
{
	$parts = explode('=',$_REQUEST['token']);
	$token = $parts[1];
	echo($token . '<br /><br />');

	$graph_url = "https://graph.facebook.com/me?" . $token;
	echo($graph_url . '<br />');
	
	$user = json_decode(file_get_contents($graph_url));

	echo('<pre>');
	print_r($user);
	echo('</pre>');

	$music_url = "https://graph.facebook.com/me/music?" . $access_token;
}

?>