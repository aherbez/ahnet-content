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
	
	$tags = explode(',', $taglist);
	
	// process each tagname
	
	foreach ($tags as $tag)
	{
		$tag = mysql_real_escape_string($tag);  //**IMPORTANT!**//
		$tag = trim($tag);					//把空格去掉!!//
		$tag = strtolower($tag); 				//所有字都改成小寫//
		
		$query = "SELECT id from tags where tag_text = '$tag'";

//		$query = 'SELECT id from tags where tag_text = "$tag"';
//		這個不能用 因為中間ＴＡＧ會讓每次輸入的ＴＡＧ都是ＴＡＧ

		$result = mysql_query($query);
		
		$found = mysql_num_rows($result);
		
		if($found)
		{
			$row  = mysql_fetch_assoc($result);
			$id = $row['id'];
			echo("ALREADY HAVE $tag! <br />");
		
		}
		else
		{
			$query = "INSERT into tags (tag_text) values ('$tag')";
			mysql_query($query);
			$id = mysql_insert_id();
			echo("$tag IS NEW! <br />");
		}
		
	
	}		
	
	mysql_close();
}




?>