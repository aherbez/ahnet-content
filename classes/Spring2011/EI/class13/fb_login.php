<?php

require_once('facebook.php');

function getImg($id)
{
   return ('<img src="https://graph.facebook.com/' . $id . '/picture" />'); 
}

$app_id = '127751073968970';
$app_secret = 'bebc553837f311353c846b5c7f283425';
$my_url = "http://www.adrianherbez.net/classes/Spring2011/EI/class13/fb_login.php";
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
    
    $graph_url = "https://graph.facebook.com/me?" . $access_token;
    
    $user = json_decode(file_get_contents($graph_url));

    echo('<pre>');
    print_r($user);
    echo('</pre>');

    $music_url = "https://graph.facebook.com/me/music?" . $access_token;
    
    $music = json_decode(file_get_contents($music_url));

    
    $fql_base = "https://api.facebook.com/method/fql.query?format=JSON&query=";
	    
    // By default only 25 results are returned. We can get up to 256 by setting 
    // the LIMIT clause though
    $query =
    "SELECT created_time, post_id, actor_id, target_id, message, attachment 
    FROM stream 
    WHERE filter_key in (SELECT filter_key FROM stream_filter WHERE uid=me() AND type='newsfeed') 
    AND is_hidden = 0 LIMIT 5";

    $url = $fql_base. urlencode($query) . "&" . $access_token;
    $posts = json_decode(file_get_contents($url));

    /*
    echo('<pre>');
    print_r($posts);
    echo('</pre>');
    */
}
?>