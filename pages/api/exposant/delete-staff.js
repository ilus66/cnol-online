import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code, staffId } = req.body;

    if (!code || !staffId) {
      return res.status(400).json({ message: 'Code exposant et staffId requis' });
    }

    // Vérifier le code exposant
    const exposantsPath = path.join(process.cwd(), 'data', 'exposants.json');
    const exposants = JSON.parse(fs.readFileSync(exposantsPath, 'utf8'));
    const exposant = exposants.find(e => e.code === code);

    if (!exposant) {
      return res.status(404).json({ message: 'Code exposant non trouvé' });
    }

    // Lire le staff existant
    const staffPath = path.join(process.cwd(), 'data', 'exposant-staff.json');
    let staff = [];
    if (fs.existsSync(staffPath)) {
      staff = JSON.parse(fs.readFileSync(staffPath, 'utf8'));
    }

    // Supprimer le membre
    const newStaff = staff.filter(s => !(s.id === staffId && s.exposantCode === code));
    fs.writeFileSync(staffPath, JSON.stringify(newStaff, null, 2));

    // Retourner la nouvelle liste du staff pour cet exposant
    const exposantStaff = newStaff.filter(s => s.exposantCode === code);

    return res.status(200).json({
      message: 'Membre staff supprimé',
      staff: exposantStaff
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 