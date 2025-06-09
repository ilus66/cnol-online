import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { qrData } = req.body;
    if (!qrData) {
      return res.status(400).json({ message: 'QR code requis' });
    }

    // Recherche dans visiteurs
    const visiteursPath = path.join(process.cwd(), 'data', 'visiteurs.json');
    let user = null;
    if (fs.existsSync(visiteursPath)) {
      const visiteurs = JSON.parse(fs.readFileSync(visiteursPath, 'utf8'));
      user = visiteurs.find(v => v.userId === qrData);
      if (user) user.type = 'visiteur';
    }

    // Recherche dans exposant-staff
    if (!user) {
      const staffPath = path.join(process.cwd(), 'data', 'exposant-staff.json');
      if (fs.existsSync(staffPath)) {
        const staff = JSON.parse(fs.readFileSync(staffPath, 'utf8'));
        user = staff.find(s => s.id === qrData);
        if (user) user.type = 'staff';
      }
    }

    // Recherche dans exposants
    if (!user) {
      const exposantsPath = path.join(process.cwd(), 'data', 'exposants.json');
      if (fs.existsSync(exposantsPath)) {
        const exposants = JSON.parse(fs.readFileSync(exposantsPath, 'utf8'));
        user = exposants.find(e => e.code === qrData);
        if (user) user.type = 'exposant';
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Log horodaté
    const logPath = path.join(process.cwd(), 'data', 'scan-log.json');
    let logs = [];
    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
    const logEntry = {
      date: new Date().toISOString(),
      qrData,
      user,
    };
    logs.push(logEntry);
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error scanning QR:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 