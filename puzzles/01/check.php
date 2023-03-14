<?php

$salt = 'BUDDY BOLDEN WAS A BADASS';

$db_host = 'mysql.adrianherbez.net';
$db_user = 'puzzles_user';
$db_pass = 's0lv3mor3';
$db_name = 'aherbez_puzzles';

$ans = '';
$puzzle = 5;

if (!empty($_POST['solution']))
{
	$ans = $_POST['solution'];
}

if (!empty($_POST['puzzle']))
{
	$puzzle = intval($_POST['puzzle']);
}

$con = mysql_connect($db_host, $db_user, $db_pass);

if (!$con)
{
	die(mysql_error());
}

mysql_select_db($db_name);

$query = "SELECT * from puzzles where id = " . intval($puzzle) . " LIMIT 1";

$result = mysql_query($query);

$success = false;

if ($result)
{

	$row = mysql_fetch_assoc($result);
	$test = md5(trim($ans) . $salt);

	if (strcmp($test, $row['solution']) == 0)
	{
		$success = true;
	}

}

mysql_close();

?>

<html>
<head>
<title>Number by Colors</title>

<style type="text/css">

body {
	background-color: #000;
	color: #FFF;
	font-family: arial, sans;
}

</style>

</head>

<body>

<?php 
if ($success)
{
?>
<h1>Well done!</h1>

Fantastic! Impressive! Very well done, indeed!. <br /><br />

Enjoy this video of Jelly Roll Morton performing the Buddy Bolden Blues: <br />

<center>
<object width="425" height="350"><param name="movie" value="http://www.youtube.com/v/vgmZyImasvA&autoplay=1"></param><embed src="http://www.youtube.com/v/vgmZyImasvA&autoplay=1" type="application/x-shockwave-flash" width="425" height="350"></embed></object>
</center>

<?php
}
else
{
?>

<h1>FALSE</h1>

Not quite- try again.


<?php
}
?>


</body>
</html>