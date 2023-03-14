<?php
// tuto1.php
require('../fpdf.php');

$pdf=new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial','B',16);
$pdf->Cell(40,10,'Why does this work, but not the other?');
$pdf->Output();
?>
