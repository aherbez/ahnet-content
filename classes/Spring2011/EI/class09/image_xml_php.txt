<?php

// output a list of images in the database

$db = 'mysql.adrianherbez.net';
$user = 'example_user';
$password = 'MyPassw0rd';

mysql_connect($db,$user,$password) or die(mysql_error());
mysql_select_db('aherbez_example');

$query = "SELECT name,id from images";
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