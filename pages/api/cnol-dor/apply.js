import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { cnolDorReceivedTemplate } from '../../../lib/emailTemplates.js';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    // Utilisation de formidable pour gérer l'upload de fichiers
    const formidable = (await import('formidable')).default;
    const form = new formidable.IncomingForm({ multiples: false, uploadDir: path.join(process.cwd(), 'public/uploads/cnol-dor'), keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(400).json({ message: 'Erreur upload' });
      const { nom, email, categorie } = fields;
      if (!nom || !email || !categorie) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
      }
      // Stocker la candidature
      const cnolDorPath = path.join(process.cwd(), 'data', 'cnol-dor.json');
      let candidatures = [];
      if (fs.existsSync(cnolDorPath)) {
        candidatures = JSON.parse(fs.readFileSync(cnolDorPath, 'utf8'));
      }
      const id = uuidv4();
      const fileUrl = files && files.file ? `/uploads/cnol-dor/${path.basename(files.file.path)}` : '';
      const candidature = { id, nom, email, categorie, fileUrl, createdAt: new Date().toISOString() };
      candidatures.push(candidature);
      fs.writeFileSync(cnolDorPath, JSON.stringify(candidatures, null, 2));
      // Envoi email
      const ficheUrl = `${process.env.BASE_URL || ''}/cnol-dor/${id}`;
      const { subject, text, html } = cnolDorReceivedTemplate({ name: nom, categorie, ficheUrl });
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
      return res.status(200).json({ message: 'Candidature enregistrée', id, ficheUrl });
    });
  } catch (error) {
    console.error('Error CNOL dOr apply:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 