<?php

// output a list of images in the database

$db = 'mysql.adrianherbez.net';
$user = 'example_user';
$password = 'MyPassw0rd';

mysql_connect($db,$user,$password) or die(mysql_error());
mysql_select_db('aherbez_example');

if (!empty($_GET['search']))
{
	echo('LISTING IMAGES TAGGED ' . $_GET['search'] . '<br />');
	$tag = mysql_real_escape_string($_GET['search']);
	$query = "SELECT images.* from images, tags, image_tag WHERE
		tags.tag_text = '$tag' AND
		tags.id = image_tag.tag_id AND
		images.id = image_tag.image_id";
}
else
{
	echo('LISTING ALL IMAGES <br />');
	$query = "SELECT name,id from images";
}

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
	
	//echo("<img src='show_thumb.php?img_id=");
	echo($row['name']);
	//echo("'>");
	echo("</a>");
	echo("<br />");
	
	
	
	// echo($row['name'] . ' ' . $row['id'] . '<br />');
	
}



mysql_close();



?>