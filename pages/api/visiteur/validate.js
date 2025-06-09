import fs from 'fs';
import path from 'path';
import { registrationValidatedTemplate } from '../../../lib/emailTemplates.js';
import nodemailer from 'nodemailer';
import { generateBadge } from '../../../generateBadge.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'ID requis' });
    }
    const visiteursPath = path.join(process.cwd(), 'data', 'visiteurs.json');
    let visiteurs = [];
    if (fs.existsSync(visiteursPath)) {
      visiteurs = JSON.parse(fs.readFileSync(visiteursPath, 'utf8'));
    }
    const idx = visiteurs.findIndex(v => v.id === id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Visiteur non trouvé' });
    }
    visiteurs[idx].status = 'validated';
    fs.writeFileSync(visiteursPath, JSON.stringify(visiteurs, null, 2));
    // Générer le badge PDF
    const badgeData = {
      name: `${visiteurs[idx].prenom} ${visiteurs[idx].nom}`,
      userId: id,
      type: 'visiteur',
      email: visiteurs[idx].email
    };
    const badgePath = await generateBadge(badgeData);
    const badgeUrl = `/badges/${path.basename(badgePath)}`;
    // Envoi email
    const { subject, text, html } = registrationValidatedTemplate({
      name: `${visiteurs[idx].prenom} ${visiteurs[idx].nom}`,
      pin: visiteurs[idx].pin,
      badgeUrl: `${process.env.BASE_URL || ''}${badgeUrl}`
    });
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: visiteurs[idx].email,
      subject,
      text,
      html
    });
    return res.status(200).json({ message: 'Visiteur validé et email envoyé', badgeUrl });
  } catch (error) {
    console.error('Error validating visitor:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 