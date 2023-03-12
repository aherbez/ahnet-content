<?php

/* 

www.adrianherbez.net/classes/Spring2011/EI/class13/get_code.php

*/

require_once('facebook.php');

$app_id = '127751073968970';
$app_secret = 'bebc553837f311353c846b5c7f283425';
$my_url = "http://www.adrianherbez.net/classes/Spring2011/EI/class13/request_token.php";
$permissions = 'read_stream,user_likes';

$facebook = new Facebook($app_id, $app_secret);

$dialog_url = "http://www.facebook.com/dialog/oauth?client_id=" 
	. $app_id . "&redirect_uri=" . urlencode($my_url) . '&scope=' . $permissions;

header('Location: ' . $dialog_url);

?>