<?php

function getProfilePic($id)
{
	return ('<img src="https://graph.facebook.com/' . $id . '/picture" />');
}

function getFBName($id)
{
	$info = file_get_contents("https://graph.facebook.com/" . $id);
	$info = json_decode($info);
	return $info->name;
}


require_once('facebook.php');

$app_id = '111024538981962';
$app_secret = '24287facf85cb0f6531f854fcf643a1c';
$my_url = 'http://www.adrianherbez.net/classes/Spring2011/EI/class12/demo/get_data.php';
$permissions = 'user_likes,read_stream';

$code = $_REQUEST['code'];

if (empty($code))
{
	// not authenticated yet, start the process
	$dialog_url = "http://www.facebook.com/dialog/oauth?client_id=";
	$dialog_url .= $app_id . "&redirect_uri=" . urlencode($my_url);
	$dialog_url .= "&scope=" . $permissions;
	
	header('Location: ' . $dialog_url);	
}
else
{
 	// facebook has gotten back to us, is saying 
 	// "tell me something only you would know"
 	$token_url = "https://graph.facebook.com/oauth/access_token";
 	$token_url .= "?client_id=" . $app_id . "&redirect_uri=";
 	$token_url .= urlencode($my_url);
 	$token_url .= "&client_secret=" . $app_secret;
 	$token_url .= "&code=" . $code;
 	
 	$access_token = file_get_contents($token_url);

	$user_info_url = "https://graph.facebook.com/me?" . $access_token;
	$user_info = file_get_contents($user_info_url);
	$user_info = json_decode($user_info);
	
	/*
	echo('<pre>');
	print_r($user_info);
	echo('</pre>');
	*/
	
	/*
	echo('<h2>You are:</h2>');
	echo(getProfilePic($user_info->id));
	echo($user_info->name);
	*/
	$music_url = "https://graph.facebook.com/me/music?" . $access_token;
	$music = file_get_contents($music_url);
	$music = json_decode($music);
	
	/*
	echo('<h2>You Like:</h2>');
	foreach ($music->data as $band)
	{
		echo('<div class="band">');
		echo(getProfilePic($band->id));
		echo($band->name);
		echo('</div>');
	}
	*/

	
	$fql_base = "https://api.facebook.com/method/fql.query?format=JSON&query=";
	
	$query = "SELECT created_time, post_id, actor_id, message, attachment FROM stream
				WHERE filter_key in 
				(SELECT filter_key FROM stream_filter WHERE uid=me() AND type='newsfeed')
				AND is_hidden = 0 LIMIT 20";
	
	$url = $fql_base . urlencode($query) . "&" . $access_token;
	$posts = file_get_contents($url);
	$posts = json_decode($posts);
	
	/*
	echo('<pre>');
	print_r($posts);
	echo('</pre>');
	*/
	
	foreach($posts as $post)
	{	
		echo('<div>');
		echo(getFBName($post->actor_id));
		echo(' says: ');
		echo($post->message);
		echo('</div>');
	
	}
	

}


?>