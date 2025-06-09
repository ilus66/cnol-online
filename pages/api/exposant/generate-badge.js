import fs from 'fs';
import path from 'path';
import { generateExposantBadge } from '../../../generateExposantBadge';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { staffId, code } = req.body;

    if (!staffId || !code) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    // Vérifier le code exposant
    const exposantsPath = path.join(process.cwd(), 'data', 'exposants.json');
    const exposants = JSON.parse(fs.readFileSync(exposantsPath, 'utf8'));
    const exposant = exposants.find(e => e.code === code);

    if (!exposant) {
      return res.status(404).json({ message: 'Code exposant non trouvé' });
    }

    // Récupérer les informations du staff
    const staffPath = path.join(process.cwd(), 'data', 'exposant-staff.json');
    const staff = JSON.parse(fs.readFileSync(staffPath, 'utf8'));
    const staffMember = staff.find(s => s.id === staffId && s.exposantCode === code);

    if (!staffMember) {
      return res.status(404).json({ message: 'Membre du staff non trouvé' });
    }

    // Générer le badge
    const badgeData = {
      nom: staffMember.nom,
      prenom: staffMember.prenom,
      fonction: staffMember.fonction,
      exposant: exposant.nom,
      userId: staffId
    };

    const badgePath = await generateExposantBadge(badgeData);

    // Retourner l'URL du badge
    const badgeUrl = `/badges-exposants/${path.basename(badgePath)}`;

    return res.status(200).json({
      message: 'Badge généré avec succès',
      badgeUrl
    });

  } catch (error) {
    console.error('Error generating staff badge:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 