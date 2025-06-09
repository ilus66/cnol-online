<?php
require_once(__DIR__ . '/../vendor/autoload.php');

// Créer le dossier badges-exposants s'il n'existe pas
$badgesDir = __DIR__ . '/../public/badges-exposants';
if (!file_exists($badgesDir)) {
    mkdir($badgesDir, 0777, true);
}

// Données de test pour le badge
$staffData = [
    'userId' => 'test-staff-123',
    'nom' => 'AKDIM Amine',
    'fonction' => 'Responsable Commercial',
    'exposant' => 'INDO',
    'email' => 'amine.akdim@indo.ma'
];

// Créer un nouveau document PDF
$pdf = new TCPDF('P', 'pt', 'A4', true, 'UTF-8', false);

// Définir les métadonnées du document
$pdf->SetCreator('CNOL Online');
$pdf->SetAuthor('CNOL');
$pdf->SetTitle('Badge Staff Exposant - ' . $staffData['nom']);

// Supprimer les en-têtes et pieds de page par défaut
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);

// Définir les marges
$pdf->SetMargins(36, 36, 36);

// Ajouter une page
$pdf->AddPage();

// Définir la police
$pdf->SetFont('helvetica', 'B', 36);

// Dimensions A4 en points
$pageWidth = $pdf->getPageWidth();
$pageHeight = $pdf->getPageHeight();
$quadrantWidth = $pageWidth / 2;
$quadrantHeight = $pageHeight / 2;

// Dessiner les lignes de pliage
$pdf->SetDrawColor(200, 200, 200);
$pdf->SetLineWidth(0.5);
$pdf->Line($quadrantWidth, 0, $quadrantWidth, $pageHeight);
$pdf->Line(0, $quadrantHeight, $pageWidth, $quadrantHeight);

// --- Quadrant 1 (Haut gauche) ---
$pdf->SetXY(36, 36);

// Nom du staff
$pdf->SetFont('helvetica', 'B', 36);
$pdf->Cell(0, 50, $staffData['nom'], 0, 1, 'L');

// Fonction
$pdf->SetFont('helvetica', '', 14);
$pdf->Cell(0, 30, $staffData['fonction'], 0, 1, 'L');

// Nom exposant
$pdf->SetFont('helvetica', 'B', 18);
$pdf->Cell(0, 30, $staffData['exposant'], 0, 1, 'L');

// Email
$pdf->SetFont('helvetica', '', 14);
$pdf->Cell(0, 30, $staffData['email'], 0, 1, 'L');

// QR Code (simulé avec un texte)
$pdf->SetXY(36, $quadrantHeight - 100);
$pdf->SetFont('helvetica', '', 10);
$pdf->Cell(0, 20, '[QR Code: ' . $staffData['userId'] . ']', 0, 1, 'L');

// Logo exposant (simulé avec un texte)
$pdf->SetXY($quadrantWidth - 100, 36);
$pdf->SetFont('helvetica', '', 10);
$pdf->Cell(0, 20, '[Logo Exposant]', 0, 1, 'L');

// --- Quadrant 2 (Haut droit) ---
$pdf->SetXY($quadrantWidth + 36, 36);
$pdf->SetFont('helvetica', 'B', 24);
$pdf->Cell(0, 30, 'CNOL 2025', 0, 1, 'L');
$pdf->SetFont('helvetica', '', 14);
$pdf->Cell(0, 20, 'Congrès National d\'Optique Lunetterie', 0, 1, 'L');

// --- Quadrant 3 (Bas gauche) ---
$pdf->SetXY(36, $quadrantHeight + 36);
$pdf->SetFont('helvetica', 'B', 16);
$pdf->Cell(0, 30, 'Conseils d\'utilisation', 0, 1, 'L');
$pdf->SetFont('helvetica', '', 12);
$conseils = [
    '- Imprimer le badge en couleur',
    '- Plier selon les pointillés',
    '- Présenter à l\'accueil',
    '- Une pièce d\'identité pourra être demandée'
];
foreach ($conseils as $conseil) {
    $pdf->Cell(0, 20, $conseil, 0, 1, 'L');
}

// --- Quadrant 4 (Bas droit) ---
$pdf->SetXY($quadrantWidth + 36, $quadrantHeight + 36);
$pdf->SetFont('helvetica', 'B', 14);
$pdf->Cell(0, 20, 'Centre de conférences Fm6education', 0, 1, 'L');
$pdf->Cell(0, 20, 'Av. Allal Al Fassi, RABAT', 0, 1, 'L');
$pdf->Cell(0, 20, '10-12 OCT. 2025', 0, 1, 'L');

// Sauvegarder le PDF
$outputPath = $badgesDir . '/' . $staffData['userId'] . '.pdf';
$pdf->Output($outputPath, 'F');

echo "Badge généré avec succès !\n";
echo "Chemin du badge: " . $outputPath . "\n"; 