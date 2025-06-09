import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { generateExposantBadge } from '../../../generateExposantBadge.js';
import { sendBadgeEmail } from '../../../sendEmail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code, nom, prenom, fonction, email } = req.body;

    if (!code || !nom || !prenom || !fonction || !email) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
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

    // Vérifier la limite de 10 staff par exposant
    const exposantStaff = staff.filter(s => s.exposantCode === code);
    if (exposantStaff.length >= 10) {
      return res.status(400).json({ message: 'Limite de 10 membres du staff atteinte' });
    }

    // Créer le nouveau membre du staff
    const newStaff = {
      id: uuidv4(),
      exposantCode: code,
      nom,
      prenom,
      fonction,
      email,
      createdAt: new Date().toISOString()
    };

    // Ajouter le nouveau staff
    staff.push(newStaff);

    // Sauvegarder les modifications
    fs.writeFileSync(staffPath, JSON.stringify(staff, null, 2));

    // Générer le badge PDF
    const exposantNom = exposant.nom;
    const badgeData = {
      nom: newStaff.nom,
      prenom: newStaff.prenom,
      fonction: newStaff.fonction,
      exposant: exposantNom,
      userId: newStaff.id
    };
    const badgePath = await generateExposantBadge(badgeData);
    const badgeUrl = `/badges-exposants/${path.basename(badgePath)}`;

    // Envoyer l'email automatique
    await sendBadgeEmail({
      email: newStaff.email,
      name: `${newStaff.prenom} ${newStaff.nom}`,
      userId: newStaff.id,
      exposant: exposantNom,
      badgeUrl
    });

    return res.status(200).json({
      message: 'Staff ajouté avec succès',
      newStaff,
      badgeUrl
    });

  } catch (error) {
    console.error('Error adding staff:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 