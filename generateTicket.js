import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A4 dimensions in points (72 points = 1 inch)
const A4_WIDTH = 595.28;  // 210mm
const A4_HEIGHT = 841.89; // 297mm

export async function generateTicket(sessionData) {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    // Ensure tickets directory exists
    const ticketsDir = path.join(process.cwd(), 'public', 'tickets');
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

    // Add content to the ticket
    const { width, height } = page.getSize();
    const margin = 50;

    // Title
    page.drawText('CNOL 2025 - Ticket de réservation', {
      x: margin,
      y: height - margin,
      size: 20,
      color: rgb(0, 0, 0),
    });

    // Session details
    const details = [
      { label: 'Session', value: sessionData.titre },
      { label: 'Type', value: sessionData.type === 'atelier' ? 'Atelier' : 'Masterclass' },
      { label: 'Intervenant', value: sessionData.intervenant },
      { label: 'Salle', value: sessionData.salle },
      { label: 'Date', value: new Date(sessionData.date).toLocaleDateString() },
      { label: 'Horaire', value: sessionData.heure },
      { label: 'Réservation', value: sessionData.reservationId },
    ];

    let y = height - margin - 40;
    details.forEach(({ label, value }) => {
      page.drawText(`${label} :`, {
        x: margin,
        y,
        size: 12,
        color: rgb(0.4, 0.4, 0.4),
      });

      page.drawText(value, {
        x: margin + 120,
        y,
        size: 12,
        color: rgb(0, 0, 0),
      });

      y -= 25;
    });

    // Add instructions
    y -= 20;
    page.drawText('Instructions :', {
      x: margin,
      y,
      size: 14,
      color: rgb(0, 0, 0),
    });

    y -= 25;
    const instructions = [
      '1. Présentez ce ticket à l\'entrée de la salle',
      '2. Arrivez 15 minutes avant le début de la session',
      '3. Une pièce d\'identité pourra vous être demandée',
      '4. Ce ticket est personnel et non transférable'
    ];

    instructions.forEach(instruction => {
      page.drawText(instruction, {
        x: margin,
        y,
        size: 10,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= 20;
    });

    // Generate QR code
    const qrCodeData = JSON.stringify({
      id: sessionData.reservationId,
      session: sessionData.titre,
      date: sessionData.date,
      email: sessionData.email
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
    const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
    const qrCodeSize = 150;

    // Add QR code
    page.drawImage(qrCodeImage, {
      x: width - margin - qrCodeSize,
      y: height - margin - qrCodeSize,
      width: qrCodeSize,
      height: qrCodeSize,
    });

    // Add footer
    page.drawText('CNOL 2025 - Congrès National d\'Optique Lunetterie', {
      x: margin,
      y: margin,
      size: 10,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(ticketsDir, `${sessionData.reservationId}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);

    return outputPath;
  } catch (error) {
    console.error('Error generating ticket:', error);
    throw error;
  }
} 