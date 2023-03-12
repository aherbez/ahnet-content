<?php

$db 		= 'mysql105.secureserver.net';
$db_user 	= 'purplestatic';
$db_password 	= 'MyPassw0rd';


if (!empty($_FILES['file']))
{
	echo('uploading file! <br />');
	
	$filename = $_FILES['file']['name'];
	$tmp_name = $_FILES['file']['tmp_name'];
	$size = $_FILES['file']['size'];
	$type = $_FILES['file']['type'];
	
	echo($tmp_name . "<br />");
	
	$fp = fopen($tmp_name,'r');
	$content = fread($fp,filesize($tmp_name));
	fclose($fp);
	
	mysql_connect($db,$db_user,$db_password) or die(mysql_error());
	mysql_select_db('purplestatic');
	
	// create a thumnail image
	$im = imagecreatefromstring($content);
	$thumb = imagecreatetruecolor(100,100);
	
	$content = addslashes($content);
	
	imagecopyresampled($thumb,$im,0,0,0,0,100,100,100,100);

	ob_start();
	imagejpeg($thumb);
	$thumb_data = ob_get_contents();
	ob_end_clean();
	
	// $thumb_dat = fread($thumb,filesize($thumb));
	$thumb_data = addslashes($thumb_data);
	
	echo('Connected!<br />');
	
	$query = "INSERT INTO photos (name,image,thumbnail) VALUES ('$filename','$content','$thumb_data')";
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


?>

<html>

<form method="POST" enctype="multipart/form-data">
<input type="hidden" name="MAX_FILE_SIZE" value="200000" />
<input name="file" type="file" id="userfile" />
<input type="submit" value="upload" />


</html>