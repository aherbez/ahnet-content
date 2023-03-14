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


//    $mechs[$row['id']] = $row['mech_name'];

if (!empty($_POST['question']))
{
    echo('<pre>');
    print_r($_POST);
    echo('</pre>');

    $query = "INSERT into things_questions (question_text) VALUES ('";
    $query .= addslashes($_POST['question']);
    $query .= "')";

    echo($query . '<br />');

    $result = mysql_query($query);
    
    if ($result)
    {
        echo('INSERTED QUESTION! <br />');
    }
    else
    {
        echo('FAILED TO INSERT: ' . mysql_error() . '<br />');
    }
}


?>
<html>
    
    <head>
        <script type="text/javascript">
        
            function setFocus()
            {
                document.getElementById('q_text').focus();
            }
            
        </script>
    </head>

<body onload="setFocus()">


<form action="insert_question.php" method="POST">
    Question: <input id="q_text" type="text" name="question" size="200" /><br />
    <input type="submit" value="Add Question" />
    
</form>

</body>
</html>