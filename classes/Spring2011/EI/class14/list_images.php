<?php

// output a list of images in the database

$db = 'mysql105.secureserver.net';
$user = 'purplestatic';
$password = 'MyPassw0rd';

mysql_connect($db,$user,$password) or die(mysql_error());
mysql_select_db('purplestatic');

$query = "SELECT name,id from photos";
$result = mysql_query($query);

while($row = mysql_fetch_assoc($result))
{
	/*
	echo("<a href='show_image.php?img_id=");
	echo($row['id']);
	echo("'>");
	echo($row['name']);
	echo("</a><br />");
	*/
	echo("<a href='show_image.php?img_id=");
	echo($row['id']);
	echo("'>");	
	
	echo("<img src='show_thumb.php?img_id=");
	echo($row['id']);
	echo("'>");
	echo("</a>");
	echo("<br />");
	
	
	
	// echo($row['name'] . ' ' . $row['id'] . '<br />');
	
}



mysql_close();



?>