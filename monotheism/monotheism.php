<?php

require('fpdf.php');

$file = 'data.txt';

$f = fopen($file,'r');
$nouns 		= fgets($f);
$mods		= fgets($f);
$adjectives 	= fgets($f);
fclose($f);

$nouns = explode(',',$nouns);
$mods 	= explode(',',$mods);
$adjectives = explode(',',$adjectives);

$cards = array();

$pdf = new FPDF('P','in','Letter');
$pdf->AddPage();
$pdf->SetFont('Arial','B',12);
// $pdf->SetTextColor(255);

$start = 0;
$count = 0;
$cardnum = 0;

for ($i=0;$i<count($nouns);$i++)
{
	if ($count > 8)
	{
		$start += 9;
		$count = 0;
		$pdf->AddPage();
	}
	
	$x = ($cardnum-$start) % 3;
	$y = floor(($cardnum-$start)/3);
	
	$x = $x * 2.6 + 0.25;
	$y = $y * 3.6 + 0.2;
	
	$pdf->Rect($x,$y,2.5,3.5);
	$pdf->Rect($x+0.2,$y+0.2,2.1,3.1);
	
	$pdf->Text($x+1.25-(strlen('THING')*0.04),$y+0.5,'THING');
	$pdf->Text($x+1.25-(strlen($nouns[$i])*0.04),$y+1.75,$nouns[$i]);
	$pdf->Text($x+1.25-(strlen('THING')*0.04),$y+3,'THING');
	
	$count++;
	$cardnum++;
}

for ($i=0;$i<count($mods);$i++)
{
	if ($count > 8)
	{
		$start += 9;
		$count = 0;
		$pdf->AddPage();
	}
	
	$x = ($cardnum-$start) % 3;
	$y = floor(($cardnum-$start)/3);
	
	$x = $x * 2.6 + 0.25;
	$y = $y * 3.6 + 0.2;
	
	$pdf->Rect($x,$y,2.5,3.5);
	$pdf->Rect($x+0.2,$y+0.2,2.1,3.1);
	
	$pdf->Text($x+1.25-(strlen('MOD')*0.04),$y+0.5,'MOD');
	$pdf->Text($x+1.25-(strlen($mods[$i])*0.04),$y+1.75,$mods[$i]);
	$pdf->Text($x+1.25-(strlen('MOD')*0.04),$y+3,'MOD');
	
	$count++;
	$cardnum++;
}

for ($i=0;$i<count($adjectives);$i++)
{
	if ($count > 8)
	{
		$start += 9;
		$count = 0;
		$pdf->AddPage();
	}
	
	$x = ($cardnum-$start) % 3;
	$y = floor(($cardnum-$start)/3);
	
	$x = $x * 2.6 + 0.25;
	$y = $y * 3.6 + 0.2;
	
	$pdf->Rect($x,$y,2.5,3.5);
	$pdf->Rect($x+0.2,$y+0.2,2.1,3.1);
	
	$pdf->Text($x+1.25-(strlen('RESULT')*0.04),$y+0.5,'RESULT');
	$pdf->Text($x+1.25-(strlen($adjectives[$i])*0.04),$y+1.75,$adjectives[$i]);
	$pdf->Text($x+1.25-(strlen('RESULT')*0.04),$y+3,'RESULT');
	
	$count++;
	$cardnum++;
}


$pdf->Output();

/*
for ($i=0;$i<15;$i++)
{
for ($j=0;$j<15;$j++)
{
	$char = substr($dat,($i*15+$j),1);

	if ($i%2 == 1)
	{
		//$pdf->Text($j*$xspace+50,$i*$yspace+10,'r');
		$x = $j*$xspace+50;
		$y = $i*$yspace+10 + $yspace/2;	
	}
	else
	{
		//$pdf->Text($j*$xspace+50+$xspace/2,$i*$yspace+10,'r');
		$x = $j*$xspace+50 + $xspace/2;
		$y = $i*$yspace+10 + $yspace/2;
	}
	
	if ($char != 'k')
	{
		$pdf->Text($x,$y,$char);
	}
}
}
*/



?>
