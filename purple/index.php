<?php

$img ='http://profile.ak.fbcdn.net/hprofile-ak-snc4/hs342.snc4/41398_582780631_9854_n.jpg';

if (!empty($_POST['image_url']))
{
	$tint = array(255,0,255);

	$img = $_POST['image_url']; 
	
	$im = @imagecreatefromjpeg($img);

	$success = imagefilter($im,IMG_FILTER_COLORIZE,80,0,100,1);

	$add_text = false;
	if (!empty($_POST['add_text']) && $_POST['add_text'] == "on")
	{
		$add_text = true;
	}
	
	if ($success)
	{
		if ($add_text)
		{
			$back = imagecolorallocate($im,123,98,186);
			$edge = imagecolorallocate($im,80,59,133);
			
			$info = getimagesize($img);
			
			$text = @imagecreatefrompng('text.png');
			
			imagefilledrectangle($im,0,$info[1]-19,$info[0],$info[1],$edge);
			imagefilledrectangle($im,3,$info[1]-16,$info[0]-3,$info[1]-3,$back);
			imagecopy($im,$text,$info[0]/2-57,$info[1]-15,0,0,114,12);
			
		
		}
		
		imagejpeg($im,"purple.jpg");
		imagedestroy($im);	
	}
}

?>

<html>
<head>

<style type="text/css">

span.ins
{
	width: 50px;
	
}

*{
	margin: 0;
}

html,body {
	height: 100%;
}

.wrapper
{
	min-height: 100%;
	height: auto !important;
	height: 100%;
	margin: 0 auto -4em;

}

.back
{
	background: #FFF;
	width: 80%;
	margin-left: auto;
	margin-right: auto;
	padding: 40px;	
}

.footer, .push
{
	clear: both;
	height: 4em;
}

body
{
	background: #7b62ba;
	font-family: arial, sans;
	font-weight: 90;
}

h1
{
	color: #7b62ba;
}

</style>

</head>

<body>



<div class="wrapper">

<div class="back">

	<center>
	<h1>PurpleProfiles</h1>
	</center>
	<br /><br />
	<div id="ins" >
	I created this page to make it easy for anyone (gay, straight, or other) to create a purple version of thier profile photo, to show solidarity with LGBT youths, and to remind them that it <b>does</b> get better. 
	</div>
	<br /><br />
	<ol>
	<li><b>Grab your image</b> Find your photo on whichever profile you want to purplize, right click and select "Copy image URL" from the ensuing menu <br />
	
	<form action="index.php" method="POST">
	<span class="ins">Image URL: </span><input type="text" name="image_url" size="100" 
	
	<?php
	if (!empty($_POST['image_url']))
	{
		echo('value="' . $_POST['image_url'] . '" ');
	}
	?>	
	
	/><br />
	</li>
	
	<li><b>Choose to include text</b> You can optionally choose to add "it gets better" text along the bottom of the modified photo. <br />
	
	<span class="ins">Include "it gets better" text: </span><input type="checkbox" name="add_text"/><br />
	
	</li>
	
	<li><b>Click this button</b>
	
	<input type="submit" value="Make Purple" /> 
	</li>
	
	</form>
	
	
<?php
if ($success)
{
?>

<li><b>Save this image</b> Upload this image back to your profile to show solidarity with LGBT youth everywhere <br />
<center>
<br />
<img src="purple.jpg" />
</center>
<br />
<br />
Now that you've done that, why not watch some <a href="http://www.youtube.com/user/itgetsbetterproject">videos</a> of others sharing their own "it gets better" stories, or listen to Golgol Bordello's awesome song, <a href="http://www.youtube.com/watch?v=sM1Ahn0Osjo">"Start Wearing Purple"</a>?.
<br />



<?php
}
?>		

</ol>
</div>
<div class="push">
</div>

</div>


<div class="footer">
<center>
<em> Created 2010, J. Adrian Herbez </em>
</center>
</div>


</body>
</html>