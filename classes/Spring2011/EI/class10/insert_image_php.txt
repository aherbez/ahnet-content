<?php

function insert_tags($taglist)
{
	$tags = explode(',',$taglist);
	$tag_ids = array();
	
	foreach($tags as $tag)
	{
		$tag = mysql_real_escape_string($tag);
		$tag = trim($tag); // remove whitespace
		$tag = strtolower($tag); // only store tags in lowercase

		$query = "SELECT id from tags where tag_text = '$tag'";
		echo($query . '<br />');

		$result = mysql_query($query);

		$found = mysql_num_rows($result);

		echo($found . '<br />');

		
		
		if ($found == 1)
		{
			// existing tag
			$row = mysql_fetch_assoc($result);
			array_push($tag_ids,$row['id']);
		}
		else
		{
			// new tag- insert into DB
			$query = "INSERT into tags (tag_text) values ('$tag')";
			mysql_query($query);
			$id = mysql_insert_id();
			array_push($tag_ids,$id);
		}
	}
	return $tag_ids;
}



if (!empty($_FILES))
{
	$con = mysql_connect('mysql.adrianherbez.net','example_user','MyPassw0rd');
	if (!$con)
	{
		die(mysql_error());
	}
	
	mysql_select_db('aherbez_example');
	
	$tmp_name = $_FILES['Filedata']['tmp_name'];
	$filename = $_FILES['Filedata']['name'];
	$tags = mysql_real_escape_string($_POST['tags']);
	
	$fp = fopen($tmp_name,'r');
	$content = fread($fp,filesize($tmp_name));
	fclose($fp);
			
	$content = addslashes($content);
	
	$tag_ids = insert_tags($tags);
	
	$query = "INSERT INTO images (name,image_data) values ('$filename','$content')";
	$result = mysql_query($query);	
	
	$img_id = mysql_insert_id();
	
	foreach($tag_ids as $tag)
	{
		$query = "INSERT INTO image_tag (image_id, tag_id) VALUES ($img_id,$tag)";
		mysql_query($query);
	}	
	
	
	mysql_close();
}


?>