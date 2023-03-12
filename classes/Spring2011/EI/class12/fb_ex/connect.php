<?php 

    $app_id = '158334190897450';
    $app_secret = "3dcb625acb0f901a0343dde919c888b3";
    $my_url = "http://www.adrianherbez.net/classes/Spring2011/EI/class12/fb_ex/connect.php";

    $code = $_REQUEST["code"];

    if(empty($code)) {
        $dialog_url = "http://www.facebook.com/dialog/oauth?client_id=" 
            . $app_id . "&redirect_uri=" . urlencode($my_url);

        echo("<script> top.location.href='" . $dialog_url . "'</script>");
    }

    $token_url = "https://graph.facebook.com/oauth/access_token?client_id="
        . $app_id . "&redirect_uri=" . urlencode($my_url) . "&client_secret="
        . $app_secret . "&code=" . $code;

    $access_token = file_get_contents($token_url);

    $graph_url = "https://graph.facebook.com/me?" . $access_token;

    $user = json_decode(file_get_contents($graph_url));

    echo('<pre>');
    print_r($user);
    echo('</pre>');
    
    echo("Hello " . $user->name);

?>