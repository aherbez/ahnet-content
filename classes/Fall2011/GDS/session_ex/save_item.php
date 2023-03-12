<?php

/* 
save_item.php

Saves a connection between a given user and a given item

save_item.php?itemID=23

*/

// what item?
if (empty($_GET['itemID']))
{
	echo("{s:0,r:'no item'}");
	return;
}

// if we're here, we have a valid $_GET['itemID']

$itemID = intval($_GET['itemID']);

session_start();

if (empty($_SESSION['userID']))
{
	echo("{s:0,r:'no user'}");
	return;
}

$itemID = intval($_GET['itemID']);
$userID = $_SESSION['userID'];

echo("SAVING LINK: $userID $itemID<br />");


?>
