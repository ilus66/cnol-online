import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { workshopReservationTemplate } from '../../../lib/emailTemplates.js';
import nodemailer from 'nodemailer';
import { generateTicket } from '../../../generateTicket.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { nom, prenom, email, atelierId, title, date, heure, lieu } = req.body;
    if (!nom || !prenom || !email || !atelierId || !title || !date || !heure || !lieu) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    const ateliersPath = path.join(process.cwd(), 'data', 'ateliers.json');
    let ateliers = [];
    if (fs.existsSync(ateliersPath)) {
      ateliers = JSON.parse(fs.readFileSync(ateliersPath, 'utf8'));
    }
    // Ajouter la réservation
    const id = uuidv4();
    const reservation = { id, nom, prenom, email, atelierId, title, date, heure, lieu, createdAt: new Date().toISOString() };
    ateliers.push(reservation);
    fs.writeFileSync(ateliersPath, JSON.stringify(ateliers, null, 2));
    // Générer le ticket PDF
    const ticketData = { nom, prenom, title, date, heure, lieu, userId: id };
    const ticketPath = await generateTicket(ticketData);
    const ticketUrl = `/badges/${path.basename(ticketPath)}`;
    // Envoi email
    const { subject, text, html } = workshopReservationTemplate({
      name: `${prenom} ${nom}`,
      title, date, heure, lieu,
      ticketUrl: `${process.env.BASE_URL || ''}${ticketUrl}`
    });
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
    return res.status(200).json({ message: 'Réservation confirmée', ticketUrl });
  } catch (error) {
    console.error('Error reserving workshop:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 