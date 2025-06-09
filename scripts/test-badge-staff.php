<?php

// Fonction pour simuler la génération du badge
function generateExposantBadge($staffData) {
    // Créer le dossier badges-exposants s'il n'existe pas
    $badgesDir = __DIR__ . '/../public/badges-exposants';
    if (!file_exists($badgesDir)) {
        mkdir($badgesDir, 0777, true);
    }

    // Créer un fichier PDF de test
    $outputPath = $badgesDir . '/' . $staffData['userId'] . '.pdf';
    
    // Créer un fichier texte temporaire pour simuler le PDF
    $content = "=== BADGE STAFF EXPOSANT ===\n\n";
    $content .= "Nom: " . $staffData['nom'] . "\n";
    $content .= "Fonction: " . $staffData['fonction'] . "\n";
    $content .= "Exposant: " . $staffData['exposant'] . "\n";
    $content .= "Email: " . $staffData['email'] . "\n";
    $content .= "ID: " . $staffData['userId'] . "\n";
    $content .= "\n[QR Code serait généré ici]\n";
    $content .= "[Logo exposant serait affiché ici]\n";
    
    file_put_contents($outputPath, $content);
    
    return $outputPath;
}

// Données de test
$staffData = [
    'userId' => 'test-staff-123',
    'nom' => 'AKDIM Amine',
    'fonction' => 'Responsable Commercial',
    'exposant' => 'INDO',
    'email' => 'amine.akdim@indo.ma',
    'logoFileName' => 'logo-exposant-default.png'
];

echo "Génération du badge staff...\n";
$badgePath = generateExposantBadge($staffData);
echo "Badge généré avec succès !\n";
echo "Chemin du badge: " . $badgePath . "\n";
echo "\nContenu du badge:\n";
echo file_get_contents($badgePath); 