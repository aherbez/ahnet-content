<?php

// is there POST data to process? 

// Logical OR: ||
// Logical AND: &&
// Bitwise OR: |
// Bitwise AND: & 

echo('<pre>');
print_r($_POST);
echo('</pre>');
echo('<br />');

if (!empty($_POST['title']) && !empty($_POST['author']))
{

	// if yes: 
	// connect to the database
	$con = mysql_connect('mysql.adrianherbez.net','example_user','MyPassw0rd');

	if (!$con)
	{
		die(mysql_error());
	}

	mysql_select_db('aherbez_experimental');

	// sanitize the input
	$title = mysql_real_escape_string($_POST['title']);
	$author = mysql_real_escape_string($_POST['author']);

// insert the data
/*
$query = "INSERT into books (title,author) VALUES ('" +
			$_POST['title'] .
			"','" .
			$_POST['author'] . 
			"')";
*/
	$query = "INSERT into books (title,author) VALUES ('$title','$author')";

	echo($query . '<br />'); 

	$result = mysql_query($query);

	if (!$result)
	{
		echo(mysql_error());
	}

	// close the database connection
	mysql_close();

}

?>

<html>

<head>
</head>

<body>

<form method="POST" action="insert_form.php">

Title: <input type="text" name="title" /><br />
Author: <input type="text" name="author" /><br />
<input type="submit" />


</form>



</body>
</html>
