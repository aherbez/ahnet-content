<?php

$taglist = $_GET['tag'];

echo('inserting ' . $taglist . '<br />');

$con = mysql_connect('mysql.adrianherbez.net','example_user','MyPassw0rd');
if (!$con)
{
	die(mysql_error());
}
mysql_select_db('aherbez_example');

$tags = explode(',',$taglist);

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
		$row = mysql_fetch_assoc($result);
		echo('TAG FOUND WITH ID: ' . $row['id'] . '<br />');
		
	}
	else
	{
		echo('TAG NOT FOUND<br />');
		$query = "INSERT into tags (tag_text) values ('$tag')";
		mysql_query($query);
		echo('INSERTED AT: ' . mysql_insert_id() . '<br />');
		
	}
}


mysql_close();



?>