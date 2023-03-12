<?php

// this will dump a particular image to the client (browser, Flash, etc)

$img_id = $_GET['img'];

if (!empty($img_id))
{

	$db_host = 'mysql.adrianherbez.net';
	$db_username = 'example_user';
	$db_password = 'MyPassw0rd';
	
	$con = mysql_connect($db_host,$db_username,$db_password);
	if (!$con)
	{
		die(mysql_error());
	}
	mysql_select_db('aherbez_example');
	
	$img_id = mysql_real_escape_string($img_id);
	
	$query = "SELECT image_data from images where id = $img_id";
	
	$result = mysql_query($query);	
	$row = mysql_fetch_assoc($result);
	
	if ($row['image_data'])
	{
		header('Content-type: image/jpg');
		echo($row['image_data']);
	}
	else
	{
		echo('IMAGE NOT FOUND');
	}

	mysql_close();
}

?>