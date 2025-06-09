import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const ateliersPath = path.join(process.cwd(), 'data', 'ateliers.json');
    
    if (!fs.existsSync(ateliersPath)) {
      return res.status(404).json({ message: 'Atelier non trouvé' });
    }

    const ateliers = JSON.parse(fs.readFileSync(ateliersPath, 'utf8'));
    const atelier = ateliers.find(a => a.id === id);

    if (!atelier) {
      return res.status(404).json({ message: 'Atelier non trouvé' });
    }

    res.status(200).json(atelier);
  } catch (error) {
    console.error('Error fetching atelier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
} 