import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

export async function generateExposantBadge(staffData) {
  // A4 dimensions in points (72 points = 1 inch)
  const A4_WIDTH = 595.28;  // 210mm
  const A4_HEIGHT = 841.89; // 297mm

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]); // Portrait orientation

  // Ensure badges-exposants directory exists
  const badgesDir = path.join(process.cwd(), 'public', 'badges-exposants');
  if (!fs.existsSync(badgesDir)) {
    fs.mkdirSync(badgesDir, { recursive: true });
  }

  // Calculate quadrant dimensions (portrait)
  const quadrantWidth = A4_WIDTH / 2;
  const quadrantHeight = A4_HEIGHT / 2;

  // Draw dotted fold lines
  page.drawLine({
    start: { x: quadrantWidth, y: 0 },
    end: { x: quadrantWidth, y: A4_HEIGHT },
    color: rgb(0.8, 0.8, 0.8),
    dashArray: [5, 5],
  });

  page.drawLine({
    start: { x: 0, y: quadrantHeight },
    end: { x: A4_WIDTH, y: quadrantHeight },
    color: rgb(0.8, 0.8, 0.8),
    dashArray: [5, 5],
  });

  // --- Définition des quadrants (zones fixes) ---
  const quadW = A4_WIDTH / 2;
  const quadH = A4_HEIGHT / 2;

  // --- Carré 1 (haut gauche) : Informations staff ---
  const c1_margin_left = 36;
  const c1_margin_right = 36;
  const c1_margin_top = 50;
  const c1_margin_bottom = 20;
  let y1 = A4_HEIGHT - c1_margin_top;

  // Nom du staff en gras (36pt)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.drawText(staffData.nom, {
    x: c1_margin_left,
    y: y1,
    size: 36,
    font: fontBold,
    color: rgb(0, 0, 0),
    maxWidth: quadW - c1_margin_left - c1_margin_right,
  });
  y1 -= 50;

  // Fonction (14pt)
  if (staffData.fonction) {
    page.drawText(staffData.fonction, {
      x: c1_margin_left,
      y: y1,
      size: 14,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
      maxWidth: quadW - c1_margin_left - c1_margin_right,
    });
    y1 -= 30;
  }

  // Nom exposant (18pt)
  page.drawText(staffData.exposant, {
    x: c1_margin_left,
    y: y1,
    size: 18,
    font: fontBold,
    color: rgb(0, 0, 0),
    maxWidth: quadW - c1_margin_left - c1_margin_right,
  });
  y1 -= 30;

  // Email (14pt)
  if (staffData.email) {
    page.drawText(staffData.email, {
      x: c1_margin_left,
      y: y1,
      size: 14,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
      maxWidth: quadW - c1_margin_left - c1_margin_right,
    });
    y1 -= 30;
  }

  // QR code centré en bas du quadrant
  const qrCodeDataUrl = await QRCode.toDataURL(staffData.userId);
  const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
  const qrCodeSize = 100;
  const qrCodeX = c1_margin_left;
  const qrCodeY = c1_margin_bottom;
  page.drawImage(qrCodeImage, {
    x: qrCodeX,
    y: qrCodeY,
    width: qrCodeSize,
    height: qrCodeSize,
  });

  // Logo exposant à droite (ou logo par défaut si absent)
  const logoFileName = staffData.logoFileName || 'logo-exposant-default.png';
  const logoPath = path.join(process.cwd(), 'public', 'images', logoFileName);
  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    page.drawImage(logoImage, {
      x: quadW - 100,
      y: A4_HEIGHT - 100,
      width: 80,
      height: 80,
    });
  }

  // --- Carré 2 (haut droit) : Image affiche CNOL 2025, occupe tout le carré ---
  try {
    const posterImage = await pdfDoc.embedJpg(fs.readFileSync('public/images/cnol2025-poster.jpg'));
    page.drawImage(posterImage, {
      x: quadW,
      y: quadH,
      width: quadW,
      height: quadH,
    });
  } catch (error) {
    page.drawText('Affiche CNOL 2025', {
      x: quadW + 40,
      y: quadH + quadH / 2,
      size: 18,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  // --- Carré 3 (bas gauche) : Encadrement ajusté à la hauteur du texte, largeur augmentée ---
  const conseilsTitre = "Conseils d'utilisation";
  const conseilsLignes = [
    "- Imprimer le badge en couleur, plier le en 4 selon les pointillés",
    "  et le présenter à l'accueil du congrès.",
    "- À présenter le jour de l'événement",
    "- Attention la partie contenant le QR code doit être bien visible",
    "- Une pièce d'identité pourra également vous être demandée"
  ];
  const conseilsTitreSize = 10;
  const conseilsTextSize = 7.5;
  const conseilsLineHeight = 10;
  const conseilsPaddingX = 24;
  const conseilsPaddingY = 14;
  // Calculer la hauteur totale du bloc texte
  const conseilsBlocHeight = conseilsTitreSize + 8 + conseilsLignes.length * conseilsLineHeight;
  // Position du cadre (centré dans le carré 3, largeur augmentée)
  const c3_box_w = quadW - 2 * conseilsPaddingX + 30;
  const c3_box_h = conseilsBlocHeight + 2 * conseilsPaddingY;
  const c3_box_x = conseilsPaddingX - 15;
  const c3_box_y = quadH / 2 - c3_box_h / 2;
  // Rectangle d'encadrement pour conseils
  page.drawRectangle({
    x: c3_box_x,
    y: c3_box_y,
    width: c3_box_w,
    height: c3_box_h,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 1.2,
  });
  // Conseils d'utilisation dans le cadre
  let y3 = c3_box_y + c3_box_h - conseilsPaddingY - conseilsTitreSize;
  page.drawText(conseilsTitre, {
    x: c3_box_x + conseilsPaddingX,
    y: y3,
    size: conseilsTitreSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y3 -= conseilsTitreSize + 8;
  conseilsLignes.forEach(line => {
    page.drawText(line, {
      x: c3_box_x + conseilsPaddingX,
      y: y3,
      size: conseilsTextSize,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    y3 -= conseilsLineHeight;
  });

  // --- Carré 4 (bas droit) : Informations CNOL ---
  const c4_margin_left = quadW + 36;
  const c4_margin_top = quadH + 50;
  let y4 = c4_margin_top;
  page.drawText('CNOL 2025', {
    x: c4_margin_left,
    y: y4,
    size: 20,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y4 -= 30;
  page.drawText('Congrès National d\'Optique Lunetterie', {
    x: c4_margin_left,
    y: y4,
    size: 14,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });
  y4 -= 30;
  page.drawText('Centre de conférences Fm6education - Av. Allal Al Fassi, RABAT', {
    x: c4_margin_left,
    y: y4,
    size: 12,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });
  y4 -= 30;
  page.drawText('10-12 OCT. 2025', {
    x: c4_margin_left,
    y: y4,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(badgesDir, `${staffData.userId}.pdf`);
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
}

module.exports = { generateExposantBadge }; 