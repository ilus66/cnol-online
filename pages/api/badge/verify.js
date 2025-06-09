import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    
    // Vérifier le format du code (CNOL-XXXXXX)
    if (!code.match(/^CNOL-\d{6}$/)) {
      return res.status(400).json({ message: 'Format de code invalide' });
    }

    // Extraire l'ID du code
    const id = code.split('-')[1];
    
    // Vérifier si le badge existe
    const badgePath = path.join(process.cwd(), 'public', 'badges', `${id}.pdf`);
    if (!fs.existsSync(badgePath)) {
      return res.status(404).json({ message: 'Badge non trouvé' });
    }

    // Retourner l'URL du badge
    res.status(200).json({
      badgeUrl: `/badges/${id}.pdf`
    });
  } catch (error) {
    console.error('Error verifying badge:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
} 