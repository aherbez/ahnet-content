<?php

// output a list of images in the database

$db = 'mysql.adrianherbez.net';
$user = 'example_user';
$password = 'MyPassw0rd';

mysql_connect($db,$user,$password) or die(mysql_error());
mysql_select_db('aherbez_example');

if (!empty($_GET['search']))
{
	$tag = mysql_real_escape_string($_GET['search']);
	$query = "SELECT images.* from images, tags, image_tag WHERE
		tags.tag_text = '$tag' AND
		tags.id = image_tag.tag_id AND
		images.id = image_tag.image_id";			
}
else
{
	
	$query = "SELECT name,id from images";
}
$result = mysql_query($query);

echo('<imagelist>');
while($row = mysql_fetch_assoc($result))
{

	echo("<img src='show_image.php?img_id=");
	echo($row['id']);
	echo("' />");		
}
echo('</imagelist>');


mysql_close();



?>