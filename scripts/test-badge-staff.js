const { generateExposantBadge } = require('../generateExposantBadge');

async function testBadgeGeneration() {
  try {
    const staffData = {
      userId: 'test-staff-123',
      nom: 'AKDIM Amine',
      fonction: 'Responsable Commercial',
      exposant: 'INDO',
      email: 'amine.akdim@indo.ma',
      logoFileName: 'logo-exposant-default.png' // Utilise le logo par défaut
    };

    console.log('Génération du badge staff...');
    const badgePath = await generateExposantBadge(staffData);
    console.log('Badge généré avec succès !');
    console.log('Chemin du badge:', badgePath);
  } catch (error) {
    console.error('Erreur lors de la génération du badge:', error);
  }
}

testBadgeGeneration(); 