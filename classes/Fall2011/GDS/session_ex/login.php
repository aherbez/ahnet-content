<?php

session_start();

echo('<pre>');
print_r($_SESSION);
echo('</pre>');

// get a username and password from the user
if (!empty($_POST['username']) && !empty($_POST['password']))
{
		
	// hash the password
	$password = md5($_POST['password']);
	// $username = mysql_real_escape_string($_POST['username']);
	$username = $_POST['username']; // NEVER!!!!!!
	
	// check to see if a user exists in the user table with that 
	// username and (hashed) password 
	$sql = "SELECT * from users where username = '$username' AND 
	password_hash = '$password'";
	
	/*
	// connect to the DB 
	mysql_connect($db_host, $db_user, $db_pass);
	mysql_select_db($db_name);
	
	$result = mysql_query($sql);
	
	$user_found = mysql_num_rows($result);
	
	*/
	
	$user_found = false;
	
	if ($username == 'Adrian')
	{
		$user_found = true;
	}	
	
	
	if ($user_found)
	{
		echo('login successful!');
		$_SESSION['userID'] = 5;
		$_SESSION['logged_in'] = true;
	}
	else
	{
		$_SESSION['logged_in'] = false;
		$_SESSION['userID'] = 0;
	}
}
else
{
	// clear the session if blank form
	$_SESSION['logged_in'] = false;
	$_SESSION['userID'] = 0;
}




?>

<html>

<head>
<style type="text/css">
body{
	font-family: arial, sans;
}
</style>
</head>

<body>

<form action="login.php" method="POST">

<input type="text" name="username" />
<input type="text" name="password" />
<input type="submit" value="login" />
</form>




</body>
</html>
