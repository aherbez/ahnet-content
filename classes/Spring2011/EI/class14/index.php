<?php

echo('<pre>');
print_r($_POST);
print_r($_FILES);
echo('</pre>');

if (!empty($_FILES['photo']))
{
/*	
    [photo] => Array
        (
            [name] => frog.jpg
            [type] => image/jpeg
            [tmp_name] => /tmp/php9J9vrE
            [error] => 0
            [size] => 24550
        )	
*/
	$tmp_name = $_FILES['photo']['tmp_name'];
	$filename = $_FILES['photo']['name'];
	
	$fp = fopen($tmp_name,'r');
	$content = fread($fp,filesize($tmp_name));
	fclose($fp);
	
	// echo($content);
	
	$db = 'mysql105.secureserver.net';
	$user = 'purplestatic';
	$password = 'MyPassw0rd';
	
	mysql_connect($db,$user,$password) or die(mysql_error());
	mysql_select_db('purplestatic');
	
	
	
	$original = imagecreatefromstring($content);
	$thumb = imagecreatetruecolor(100,100);
	
	$info = getimagesize($tmp_name);
	
	echo('<pre>');
	print_r($info);
	echo('</pre>');
	
	imagecopyresampled($thumb,$original,0,0,0,0,100,100,$info[0],$info[1]);

	ob_start();
	imagejpeg($thumb); // creates a proper JPEG from an image resource
	$thumb_data = ob_get_contents();
	ob_end_clean();
	
	$content = addslashes($content);
	$thumb_data = addslashes($thumb_data);
	
	echo($thumb_data);
	
	$query = "INSERT INTO photos (name,image,thumbnail)
				values
				('$filename','$content','$thumb_data')";
	$result = mysql_query($query);
	if ($result)
	{
		echo("image uploaded!");
	}
	else
	{
		echo(mysql_error());
	}
	
	mysql_close();
	
	

}


?>

<html>
<head></head>

<body>

<form method="POST" action="index.php" 
	enctype="multipart/form-data" >
	<input type="hidden" name="MAX_FILE_SIZE" 
		value="200000" />
	<input type="file" name="photo" />
	<input type="submit" value="upload" />
</form>

</body>
</html>