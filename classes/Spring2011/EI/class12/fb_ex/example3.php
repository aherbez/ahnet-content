<?php

require_once 'facebook.php';
 
$appapikey = '158334190897450';
$appsecret = '3dcb625acb0f901a0343dde919c888b3';
 
$facebook = new Facebook($appapikey, $appsecret);

echo('<a href="' . $facebook->getLoginUrl() . '">login</a>');


// These following request variables need to be set in the ActionScript code
// $facebook->set_user($_REQUEST['fb_sig_user'], $_REQUEST['fb_sig_session_key']);
 
if(isset($_GET['FB_GET_USER_INFO']))
{
    // $user_details = $facebook->api_client->users_getInfo(array($_REQUEST['fb_sig_user']), array('uid', 'pic_square', 'profile_url', 'name', 'locale'));
    // I'll return this as JSON, so you would need to remember that on the Flash/Flex side if you
    // wanted to take this further
    // echo json_encode($user_details);
}

?>