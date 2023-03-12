<?php
if (!empty($_POST['title']))
{	
	if ($_POST['title'] == 'foo')
	{
		echo("{'status':1}");
	}
	else
	{
		echo("{'status':0, 'reason':1}");
	}	
}
else
{
	echo("{'status':0, 'reason':2}");
}
?>
