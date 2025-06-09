import { generateBadge } from '../generateBadge.js';

async function testBadgeVisiteur() {
  try {
    const userData = {
      name: 'Youssef El Amrani',
      function: 'Opticien',
      email: 'y.elamrani@gmail.com',
      userId: 'cnol2025-youssef-001'
    };

    console.log('Génération du badge visiteur...');
    const badgePath = await generateBadge(userData);
    console.log('Badge généré avec succès !');
    console.log('Chemin du badge :', badgePath);
  } catch (error) {
    console.error('Erreur lors de la génération du badge visiteur :', error);
  }
}

testBadgeVisiteur(); 