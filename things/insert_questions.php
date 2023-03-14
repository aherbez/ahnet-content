<?php

$db_host = 'mysql.adrianherbez.net';
$db_user = 'aherbez_ex';
$db_pass = 'rKXsy43J';
$db_name = 'aherbez_experimental';

$db_user = 'example_user';
$db_pass = 'MyPassw0rd';

$con = mysql_connect($db_host,$db_user,$db_pass);

if (!$con)
{
    die(mysql_error());
}
mysql_selectdb($db_name);


$fp = fopen('questions.txt','r');

$query = '';

$line = fgets($fp);
while($line)
{
    echo($line . '<br/>');
    
    $query = "INSERT INTO things_questions (question_text) VALUES ('$line')";
    echo($query . '<br />');
    
    $result = mysql_query($query);
    echo($result . '<br />');
    
    $line = fgets($fp);
}

fclose($fp);

/*
$query = "SELECT mech_name, mech_desc from gm_mechanics where board_game = 1 order by rand() limit 2";

$result = mysql_query($query);

$mechs = array();
$m_desc = array();
while ($row = mysql_fetch_assoc($result))
{
    $mechs[] = $row['mech_name'];
    
    if ($row['mech_desc'] == '')
    {
        $row['mech_desc'] = $row['mech_name'] . ' description';
    }
    
    $m_desc[] = $row['mech_desc'];
}

$query = "SELECT subject from gm_subject order by rand() limit 2";

$result = mysql_query($query);
$subjects = array();

while ($row = mysql_fetch_assoc($result))
{
    $subjects[] = $row['subject'];
}

mysql_close();
*/
?>

