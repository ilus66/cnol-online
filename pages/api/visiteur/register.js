import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { registrationReceivedTemplate } from '../../../lib/emailTemplates.js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { nom, prenom, email } = req.body;
    if (!nom || !prenom || !email) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const visiteursPath = path.join(process.cwd(), 'data', 'visiteurs.json');
    let visiteurs = [];
    if (fs.existsSync(visiteursPath)) {
      visiteurs = JSON.parse(fs.readFileSync(visiteursPath, 'utf8'));
    }
    // Générer un ID et un code PIN à 6 chiffres
    const id = uuidv4();
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const newVisiteur = { id, nom, prenom, email, pin, status: 'pending', createdAt: new Date().toISOString() };
    visiteurs.push(newVisiteur);
    fs.writeFileSync(visiteursPath, JSON.stringify(visiteurs, null, 2));
    // Envoi email
    const { subject, text, html } = registrationReceivedTemplate({ name: `${prenom} ${nom}` });
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      text,
      html
    });
    return res.status(200).json({ message: 'Inscription enregistrée', id, pin });
  } catch (error) {
    console.error('Error registering visitor:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 