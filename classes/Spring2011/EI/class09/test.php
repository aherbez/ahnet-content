<?php

echo('file uploaded');

if (!empty($_FILES))
{
	$con = mysql_connect('mysql.adrianherbez.net','example_user','MyPassw0rd');
	if (!$con)
	{
		die(mysql_error());
	}
	
	mysql_select_db('aherbez_example');
	
	/*
	$test = $_FILES['Filedata']['name'];
	$data = $_FILES['Filedata']['tmp_name'];
	
	$foo = $test . '|' . $data;

	$query = "INSERT INTO images (name,image_data) values ('$data','image_data')";
	$result = mysql_query($query);
	*/

	$tmp_name = $_FILES['Filedata']['tmp_name'];
	$filename = $_FILES['Filedata']['name'];
	$tags = $_POST['tags'];
	
	$fp = fopen($tmp_name,'r');
	$content = fread($fp,filesize($tmp_name));
	fclose($fp);
			
	$content = addslashes($content);
	
	$query = "INSERT INTO images (name,image_data,tags)
				values
				('$filename','$content','$tags')";
	$result = mysql_query($query);	
	
	mysql_close();

}


?>