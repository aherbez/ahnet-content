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

?>

<html>
    <head>
    <title></title>
    
    <style type="text/css">
    
    body
    {
        font-family: arial, sans;
        background: #732512;
        background-image: url('pattern_049.gif');
        color: #401B13;
    }
    
    a
    {
       color: #401B13; 
    }
    
    a:visited
    {
        color: #401B13;
    }
    
    a:active
    {
        color: #401B13;
    }
    
    div#main
    {
        width: 800px;
        position: absolute;
        left: 50%;
        top: 50px;
        margin-left: -400px;
        padding: 10px;
        padding-top: 0px;
        border: 4px solid #401B13;
    
        background: #EBD8A7;
    
        -moz-border-radius: 15px;
        border-radius: 15px;
        
        /*
        background: -webkit-gradient(linear, left top, left bottom, from(rgba(235,216,167,0.9)), to(rgba(224,183,52,0.9)));
        background: -moz-linear-gradient(top, rgba(235,216,167,0.9), rgba(224,183,52,0.9));
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#EBD8A7FF, endColorstr=#E0B734FF);
        -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#EBD8A7FF, endColorstr=#E0B734FF)";
        */
    }
    
    span.mech
    {
        font-size: 25px;
        font-weight: 500;
    }
    
    div#idea
    {
        width: 80%;
        padding: 10px;
        border: 4px solid #401B13;
    
        -moz-border-radius: 15px;
        border-radius: 15px;
        
        background: -webkit-gradient(linear, left top, left bottom, from(rgba(235,216,167,0.9)), to(rgba(224,183,52,0.9)));
        background: -moz-linear-gradient(top, rgba(235,216,167,0.9), rgba(224,183,52,0.9));
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#EBD8A7FF, endColorstr=#E0B734FF);
        -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#EBD8A7FF, endColorstr=#E0B734FF)";
        
    }
    
    div.details
    {
        display: none;
        width: 80%;
        padding: 10px;
        border: 4px solid #401B13;
    
        -moz-border-radius: 15px;
        border-radius: 15px;
        
        text-align: left;
        
        background: -webkit-gradient(linear, left top, left bottom, from(rgba(235,216,167,0.9)), to(rgba(224,183,52,0.9)));
        background: -moz-linear-gradient(top, rgba(235,216,167,0.9), rgba(224,183,52,0.9));
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#EBD8A7FF, endColorstr=#E0B734FF);
        -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#EBD8A7FF, endColorstr=#E0B734FF)";
        
    }
    
    h1
    {
        font-size: 40px;
        position: relative;
        top: -20px;
    }
    
    </style>
    
    <script type="text/javascript">
    
    function showDesc(which)
    {
        document.getElementById('details'+which).style.display = 'block';

    }
    
    function hideDesc(which)
    {
        document.getElementById('details1').style.display = 'none';
        document.getElementById('details2').style.display = 'none';

    }
    
    </script>
    
    </head>
    
    <body>
        
        <div id="main">
        
        <h1><a href=""><img src="badaman_dice.png" width="55" height="55"/></a> The Game Roller</h1>

        <p>
            This page is meant to be used as a tool to generate game design ideas. Each load, it grabs two random mechanics and two random themes.
        </p>
        <p>
            Mouse over the mechanics to get a description, and either click the die or reload the page to get a new combination. Mechanics and subjects are taken from <a href="http://boardgamegeek.com/">Board Game Geek</a>.
        </p>

            <center>
        
        <div id="idea">                
            <div id="mechanics">
                <span id="m1" class="mech" onmouseover="showDesc(1)" onmouseout="hideDesc()"><?php echo($mechs[0]);?></span>
                /
                <span id="m2" class="mech" onmouseover="showDesc(2)" onmouseout="hideDesc()"><?php echo($mechs[1]);?></span>
            </div>
            ABOUT
            <div id="subjects">
                <span id="s1" class="mech"><?php echo($subjects[0]);?></span>
                /
                <span id="s2" class="mech"><?php echo($subjects[1]);?></span>
                
            </div>
        </div>
        
        <br /> <br />
        
        <div id="details1" class="details">
            <?php echo($m_desc[0]); ?>
        </div>
        
        <div id="details2" class="details">
            <?php echo($m_desc[1]); ?>
        </div>
        
            </center>
        
        </div>
    
    </body>
</html>
