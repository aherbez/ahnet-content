<?php

$db_host = 'mysql.adrianherbez.net';
$db_user = 'example_user';
$db_password = 'MyPassw0rd';

$con = mysql_connect($db_host,$db_user,$db_password);
if (!$con)
{
	die(mysql_error());
}

mysql_select_db('aherbez_example');

$query = "SELECT name,id from images";

if (!empty($_GET['search']))
{
	$search = mysql_real_escape_string($_GET['search']);
	
	$query = "SELECT image.id, images.name 
				FROM tags, image_tag, images 
				WHERE tags. tag_text = '";
	$query .= $search;
	$query .=	"'AND image_tag.tag_id = tags.id 
				AND images.id = image_tag.image_id";
}

//echo($query . "<br/>");

$result = mysql_query($query);

echo('<imagelist>');

while($row = mysql_fetch_assoc($result))
{
	echo("<img src='show_image.php?img=" . $row['id'] . "'/>");
}
echo('</imagelist>');
mysql_close();

?>
















