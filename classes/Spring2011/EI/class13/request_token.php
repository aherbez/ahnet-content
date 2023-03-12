<?php

require_once('facebook.php');

$app_id = '127751073968970';
$app_secret = 'bebc553837f311353c846b5c7f283425';
$my_url = "http://www.adrianherbez.net/classes/Spring2011/EI/class13/request_token.php";
$permissions = 'read_stream,user_likes';

$facebook = new Facebook($app_id, $app_secret);

$code = $_REQUEST["code"];

if(empty($code))
{
	$dialog_url = "http://www.facebook.com/dialog/oauth?client_id=" 
		. $app_id . "&redirect_uri=" . urlencode($my_url) . '&scope=' . $permissions;

	header('Location: ' . $dialog_url);
}
else
{
    
    $token_url = "https://graph.facebook.com/oauth/access_token?client_id="
        . $app_id . "&redirect_uri=" . urlencode($my_url) . "&client_secret="
        . $app_secret . "&code=" . $code;
        
    $access_token = file_get_contents($token_url);

    $fql_base = "https://api.facebook.com/method/fql.query?format=JSON&query=";
	    
    // By default only 25 results are returned. We can get up to 256 by setting 
    // the LIMIT clause though
    $query =
    "SELECT created_time, post_id, actor_id, target_id, message, attachment 
    FROM stream 
    WHERE filter_key in (SELECT filter_key FROM stream_filter WHERE uid=me() AND type='newsfeed') 
    AND is_hidden = 0 LIMIT 25";

    $url = $fql_base. urlencode($query) . "&" . $access_token;
    $posts = json_decode(file_get_contents($url));

    $friend_posts = array();
    
    foreach ($posts as $post)
    {
	$p = array();
	$p['author_id'] = $post->actor_id;
	$p['message'] = $post->message;
	
	$friend_posts[] = $p;
    }
    
    echo('<pre>');
    print_r($friend_posts);
    echo('</pre>');
    
    /*
    $use_url = 'use_token.php?token=' . $access_token;
    
    $graph_url = "https://graph.facebook.com/me?" . $access_token;
    
    echo($graph_url);
    
    $user = json_decode(file_get_contents($graph_url));

    echo('<pre>');
    print_r($user);
    echo('</pre>');

    $music_url = "https://graph.facebook.com/me/music?" . $access_token;   
	*/
}

?>