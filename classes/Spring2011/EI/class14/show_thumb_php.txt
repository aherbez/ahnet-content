<?php

// show a single image by dumping JPEG data to browser

if (!empty($_GET['img_id']))
{
	$db = 'mysql105.secureserver.net';
	$user = 'purplestatic';
	$password = 'MyPassw0rd';

	mysql_connect($db,$user,$password) or die(mysql_error());
	mysql_select_db('purplestatic');
	
	$id = $_GET['img_id'];
	$query = "SELECT thumbnail as data from photos where id = $id";
	
	$result = mysql_query($query);
	
	if ($result)	
	{
		$row = mysql_fetch_assoc($result);
		header('Content-type: image/jpeg');
		echo($row['data']);
	}


	mysql_close();
}



?>