<?php


$taglist = $_GET['tag'];

if (!empty($taglist))
{
	
	$db_host = 'mysql.adrianherbez.net';	
	$db_username = 'example_user';
	$db_password = 'MyPassw0rd';
	
	$con = mysql_connect($db_host,$db_username,$db_password);
	
	if(!$con)
	{
		die(mysql_error());	
	}
	mysql_select_db('aherbez_example');
	
	echo($taglist);
	
	mysql_close();
}




?>