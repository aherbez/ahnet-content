<?php

if (!empty($_FILES['Filedata']))
{
	$con = mysql_connect('mysql.adrianherbez.net','example_user','MyPassw0rd');
	if (!con)
	{
		die(mysql_error());
	}
	mysql_select_db('aherbez_example');
	
	$name = $_FILES['Filedata']['name'];
	$tmp_name = $_FILES['Filedata']['tmp_name'];
	$tags = mysql_real_escape_string($_POST['tags']);
	
	$fp = fopen($tmp_name,'r');
	$content = fread($fp,filesize($tmp_name));
	fclose($fp);
	
	$myVar = 23;
	echo("$myVar"); // outputs 23
	echo('$myVar'); // outputs $myVar
	
	$content = addslashes($content);
	
	$query = "INSERT into images (name,image_data,tags) values 
			('$filename','$content','$tags')";
	mysql_query($query);
	
	mysql_close();
}




?>