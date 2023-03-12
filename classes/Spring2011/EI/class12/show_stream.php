<?php

require_once('facebook.php');

$app_id = '120033581410226';
$app_secret = 'a32f8a0af6b1699142d5bda88b59ddbe';

// Create our Application instance (replace this with your appId and secret).
$facebook = new Facebook(array(
  'appId'  => $app_id,
  'secret' => $app_secret,
  'cookie' => true,
));

if ($facebook->getSession()) {
  echo '<a href="' . $facebook->getLogoutUrl() . '">Logout</a>';
} else {
  echo '<a href="' . $facebook->getLoginUrl() . '">Login</a>';
}


?>