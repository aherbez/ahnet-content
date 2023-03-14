<?php

// $img ='http://profile.ak.fbcdn.net/hprofile-ak-snc4/hs342.snc4/41398_582780631_9854_n.jpg';

$newname = 'rainbow.jpg';

if (!empty($_POST['image_url']))
{
	$tint = array(255,0,255);

	$img = $_POST['image_url']; 
	
	$im = @imagecreatefromjpeg($img);

	$red = [228, 3, 3];
	$orange = [255, 140, 0];
	$yellow = [255, 237, 0];
	$green = [0, 128, 38];
	$blue = [0, 77, 255];
	$violet = [117, 7, 135];

	$colors = [[228, 3, 3], [255, 140, 0],[255, 237, 0], [0, 128, 38], [0, 77, 255], [117, 7, 135]];

	$success = true;

	$images = array();
	for ($i=0; $i < 6; $i++)
	{

		array_push($images, @imagecreatefromjpeg($img));

		// this is crazy- no idea why it works with this, but not with array access
		switch($i)
		{
			case 0:
			{
				imagefilter($images[$i], IMG_FILTER_COLORIZE, 228, 3, 3);
				break;
			}
			case 1:
			{
				imagefilter($images[$i], IMG_FILTER_COLORIZE, 255, 140, 0);
				break;
			}
			case 2:
			{
				imagefilter($images[$i], IMG_FILTER_COLORIZE, 255, 237, 0);
				break;
			}
			case 3:
			{
				imagefilter($images[$i], IMG_FILTER_COLORIZE, 0, 128, 38);
				break;
			}
			case 4:
			{
				imagefilter($images[$i], IMG_FILTER_COLORIZE, 0, 77, 255);
				break;
			}
			case 5:
			{
				imagefilter($images[$i], IMG_FILTER_COLORIZE, 117, 7, 135);
				break;
			}
			default:
			{
				break;
			}												
		}

		// $success = imagefilter($images[$i], IMG_FILTER_COLORIZE, intval($colors[i][0]), intval($colors[i][1]), intval($colors[i][2]), 1);
		// $success = imagefilter($images[$i], IMG_FILTER_COLORIZE, 228, 3, 3);
	}

	$imgsize = getimagesize($img);
	$stripheight = intval($imgsize[1]/6);
	$imgwidth = $imgsize[0];

	for ($i=1; $i<6; $i++)
	{
		imagecopy ($images[0], $images[$i] , 0 , $i * $stripheight , 0 , $i * $stripheight , $imgwidth , $stripheight );
	}
	
	if ($success)
	{
		imagejpeg($images[0],$newname);
	
		for ($i=0; $i < 6; $i++)
		{
			imagedestroy($images[$i]);
		}
	}
	else
	{
		echo("<h2>ERROR</h2>");
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
    background-image: url("rainbow_bk.jpg");
	font-family: arial, sans;
	font-weight: 90;
}


</style>

</head>

<body>



<div class="wrapper">

<div class="back">

	<center>
	<h1>Rainbow Profiles</h1>
	</center>
	<br /><br />
	<div id="ins" >
	I created this page to make it easy for anyone (gay, straight, or other) to create a rainbow version of thier profile photo, in celebration of the landmark SCOTUS decision that recognized that <em>all</em> people deserve the same rights.</div>
	<br /><br />
	This is an updated version of a page I made years ago that would make a profile image purple, and add "it gets better" to the image. 
	<br />
	To see that in action, head <a href="http://www.adrianherbez.net/purple/">here</a>.

	<br /><br />
	<ol>
	<li><b>Grab your image</b> Find your photo on whichever profile you want to make awesome, right click and select "Copy image URL" from the ensuing menu <br />
	
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
	
	<li><b>Click this button</b>
	
	<input type="submit" value="Make Fabulous" /> 
	</li>
	
	</form>
	
	
<?php
if ($success)
{
?>

<li><b>Save this image</b> Upload this image back to your profile to show solidarity with people everywhere <br />
<center>
<br />
<img src="<?php echo($newname);?>" />
</center>
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
<em> Created 2015, J. Adrian Herbez </em>
</center>
</div>


</body>
</html>