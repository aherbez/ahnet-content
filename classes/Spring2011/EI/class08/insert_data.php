<?php

$images = array('lolcat1.jpg',
                'lolcat4.jpg',
                'lolcat7.jpg',
                'loldog2.jpg',
                'loldog6.jpg',
                'lolcat10.jpg',
                'lolcat5.jpg',
                'lolcat8.jpg',
                'loldog3.jpg',
                'lolcat2.jpg',
                'lolcat6.jpg',
                'lolcat9.png',
                'loldog4.jpg',
                'lolcat3.jpg',
                'lolcat7.gif',
                'loldog1.jpg',
                'loldog5.jpg');

$db_host        = "mysql105.secureserver.net";
$db_username    = "purplestatic";
$db_password    = "MyPassw0rd";
$db             = 'purplestatic';


$db_host        = "mysql.adrianherbez.net";
$db_username    = "example_user";
$db_password    = "MyPassw0rd";
$db             = 'aherbez_example';

$con = mysql_connect($db_host,$db_username,$db_password) or die(mysql_error());


for ($i=0;$i<count($images);$i++)
{
    if (strpos($images[$i],'cat'))
    {
        echo('CAT ');
    }
    else
    {
        echo('DOG ');
    }
    
    echo('inserting ' . $images[$i] . '<br />');
    
}

mysql_close();

?>
