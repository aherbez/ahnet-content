<?php

require('fpdf.php');

$dat = $_POST['data'];

// x244 266 | x163 184 | 254 275 | x:20
// y183 163

$pdf = new FPDF('P','mm','A4');
$pdf->AddPage();
$pdf->SetFont('Arial','',12);
$pdf->Rect(50,10,96,89,'F');
$pdf->SetTextColor(255);

$xspace = 6;
$yspace = 5;

$x = 0;
$y = 0;

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
$pdf->Output();


?>
