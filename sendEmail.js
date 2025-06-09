// sendEmail.js - Send badge by email with nodemailer
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// userData: { email, name, userId, exposant, badgeUrl }
export async function sendBadgeEmail(userData) {
    // Configure transporter (Gmail SMTP or other)
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const badgePath = path.join(__dirname, '../public/badges-exposants', `${userData.userId}.pdf`);
    if (!fs.existsSync(badgePath)) {
        throw new Error('Badge PDF not found: ' + badgePath);
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: userData.email,
        subject: `Votre badge CNOL 2025 – ${userData.exposant || ''}`,
        text: `Bonjour ${userData.name},\n\nVous trouverez ci-joint votre badge staff pour le CNOL 2025.\n\nLieu : Centre de conférences Fm6education, Rabat\nDates : 10-12 octobre 2025\n\nLien de téléchargement : ${userData.badgeUrl || ''}\n\nLe QR code est intégré dans le badge.\n\nCordialement,\nL'équipe CNOL`,
        attachments: [
            {
                filename: `${userData.userId}.pdf`,
                path: badgePath,
                contentType: 'application/pdf',
            },
        ],
    };

    await transporter.sendMail(mailOptions);
}