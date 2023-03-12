<?php

$db 		= 'mysql105.secureserver.net';
$db_user 	= 'purplestatic';
$db_password 	= 'MyPassw0rd';

mysql_connect($db,$db_user,$db_password) or die(mysql_error());

mysql_select_db('purplestatic');

/*
echo('<pre>');
print_r($_GET);
echo('</pre>');
*/

if (!empty($_GET['img_id']))
{
	$query = "SELECT * from images where id = " . $_GET['img_id'];
	$result = mysql_query($query);
	
	if ($result)
	{
		header('Content-type: image/jpg');
		$row = mysql_fetch_assoc($result);
		echo($row['thumbnail']);
	}
	else
	{
		echo('ERROR!');
	}

}

mysql_close();


/*
if (!empty($_FILES['file']))
{
	echo('uploading file! <br />');
	
	$filename = $_FILES['file']['name'];
	$tmp_name = $_FILES['file']['tmp_name'];
	$size = $_FILES['file']['size'];
	$type = $_FILES['file']['type'];
	
	echo($tmp_name . "<br />");
	
	$fp = fopen($tmp_name,'r');
	$content = addslashes(fread($fp,filesize($tmp_name)));
	fclose($fp);
	
	mysql_connect($db,$db_user,$db_password) or die(mysql_error());
	mysql_select_db('purplestatic');
	
	echo('Connected!<br />');
	
	$query = "INSERT INTO images (name,size,content) VALUES ('$filename','$size','$content')";
	// echo($query);
	$result = mysql_query($query);
	
	if ($result)
	{
		echo($result);
	}
	else
	{
		echo(mysql_error());
	}
	
	mysql_close();
}
*/


?>