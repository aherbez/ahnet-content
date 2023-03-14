<?php

if (isset($_GET['img']) && $_GET['img'] != '')
{
    // $im = @imagecreatefrompng('http://www.minecraftskins.com/view/' . $_GET['img']);
    $im = @imagecreatefrompng($_GET['img']);
    // echo('http://www.minecraftskins.com/view/' . $_GET['img']);
    
    // imagealphablending($im, false);
    // imagesavealpha($im, true);

    header('Content-type: image/png');
    imagepng($im);
    imagedestroy($im);

}

?>