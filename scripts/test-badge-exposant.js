import { generateExposantBadge } from './generateExposantBadge.js';

async function testBadgeExposant() {
  try {
    const userData = {
      name: 'Amine Akdim',
      exposant: 'INDO',
      function: '', // remplacé par EXOSANT automatiquement
      email: 'amine.akdim@indo.ma',
      userId: 'cnol2025-exposant-indo-001',
      type: 'exposant',
      logoFileName: 'indo.png'
    };

    console.log('Génération du badge exposant...');
    const badgePath = await generateExposantBadge(userData);
    console.log('Badge exposant généré avec succès !');
    console.log('Chemin du badge :', badgePath);
  } catch (error) {
    console.error('Erreur lors de la génération du badge exposant :', error);
  }
}

testBadgeExposant(); 