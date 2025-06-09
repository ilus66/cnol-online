import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return res.status(400).json({ message: 'Code invalide' });
    }

    // Lire le fichier des exposants
    const exposantsPath = path.join(process.cwd(), 'data', 'exposants.json');
    const exposants = JSON.parse(fs.readFileSync(exposantsPath, 'utf8'));

    // Vérifier le code
    const exposant = exposants.find(e => e.code === code);

    if (!exposant) {
      return res.status(404).json({ message: 'Code exposant non trouvé' });
    }

    // Lire le staff de l'exposant
    const staffPath = path.join(process.cwd(), 'data', 'exposant-staff.json');
    let staff = [];
    
    if (fs.existsSync(staffPath)) {
      const allStaff = JSON.parse(fs.readFileSync(staffPath, 'utf8'));
      staff = allStaff.filter(s => s.exposantCode === code);
    }

    return res.status(200).json({
      exposant: {
        nom: exposant.nom,
        code: exposant.code
      },
      staff
    });

  } catch (error) {
    console.error('Error verifying exposant code:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 