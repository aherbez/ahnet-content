<html>
    
<?php

require_once('facebook.php');

function getImg($id)
{
   return ('<img src="https://graph.facebook.com/' . $id . '/picture" />'); 
}

function getName($id)
{
    $info = file_get_contents("https://graph.facebook.com/" . $id);
    $info = json_decode($info);
    return ($info->name);
}

$app_id = '120033581410226';
$app_secret = 'a32f8a0af6b1699142d5bda88b59ddbe';
$my_url = "http://www.adrianherbez.net/classes/Spring2011/EI/class12/get_fb_data.php";
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
    /*
    echo('<pre>');
    print_r($user);
    echo('</pre>');
    */
    $music_url = "https://graph.facebook.com/me/music?" . $access_token;
    
    $music = json_decode(file_get_contents($music_url));
    /*
    echo('<pre>');
    print_r($music);
    echo('</pre>');
    */
    
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
?>
<head>
    
    <script type="text/javascript">
    
        function replaceMe(el)
        {
            alert(el);
        }
    
    </script>
    
    <style type="text/css">
    
    body{
        font-family: arial, sans;
    }
    
    div.data
    {
        border: 2px solid #000;
        background: #444;
        color: #f1f1f1;
        padding: 5px;
	-moz-border-radius: 8px;
	-webkit-border-radius: 8px;
	border-radius: 8px;
        position: relative;
    }
    
    .data img
    {
	-moz-border-radius: 8px;
	-webkit-border-radius: 8px;
	border-radius: 8px;
        margin: 5px;
        border: 2px solid #f1f1f1;
    }
    
    span.name
    {
        font-size: 12px;
        margin-top: -12px;
        position: absolute;
        top: 50%;
    }
    
    span.message
    {
        font-size: 12px;
        margin-top: 0px;
        position: absolute;
        top: 50%;        
    }
    
    div#posts
    {
    }
    
    </style>
</head>
<body>


<h2>You:</h2>

<div class="data">
<img src="https://graph.facebook.com/<?php echo($user->id); ?>/picture" />
<span class="name"><?php echo($user->name); ?></span>
</div>
<hr />

<h2>Your music:</h2>
<?php

foreach ($music->data as $band)
{
    // print_r($band);
    echo('<div class="data">');
    echo(getImg($band->id));
    echo('<span class="name">');
    echo($band->name);
    echo('</span></div>');
    
}
?>
<br /></br />

<div id="posts">
<h2>What your friends are saying:</h2>
<?php
foreach ($posts as $post)
{
    echo('<div class="data">');
    
    echo(getImg($post->actor_id));
    echo('<span class="name">');
    echo(getName($post->actor_id));
    echo('</span>');
    
    echo('<span class="message">');
    echo($post->message);
    echo('</span>');
    echo('</div>');
}

?>
</div>
</body>

<?php


}
?>
</html>
