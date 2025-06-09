import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const ateliersPath = path.join(process.cwd(), 'data', 'ateliers.json');
    
    // Si le fichier n'existe pas, retourner un tableau vide
    if (!fs.existsSync(ateliersPath)) {
      return res.status(200).json([]);
    }

    const ateliers = JSON.parse(fs.readFileSync(ateliersPath, 'utf8'));
    res.status(200).json(ateliers);
  } catch (error) {
    console.error('Error fetching ateliers:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
} 