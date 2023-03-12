<?php

$taglist = $_GET['tag'];

if (!empty($taglist))
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

	$tags = explode(',',$taglist);
	
	// process each tag
	foreach ($tags as $tag)
	{
		$tag = mysql_real_escape_string($tag);
		$tag = trim($tag);
		$tag = strtolower($tag);
		
		$query = "SELECT id from tags where tag_text = '$tag'";
		
		$result = mysql_query($query);
		
		$found = mysql_num_rows($result);
		
		if ($found)
		{
			$row = mysql_fetch_assoc($result);
			$id = $row['id'];
			echo("ALREADY HAVE $tag! tag_id: $id<br />");
		}
		else
		{
			$query = "INSERT into tags (tag_text) values ('$tag')";
			mysql_query($query);
			$id = mysql_insert_id();
			echo("$tag IS NEW TO ME! inserted with value: $id<br />");
		}
		
	}
	// 

	mysql_close();
}



?>