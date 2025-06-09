import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

export async function generateExposantBadge(userData) {
    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

        // Ensure badges-exposants directory exists
        const badgesDir = path.join(process.cwd(), 'public', 'badges-exposants');
        if (!fs.existsSync(badgesDir)) {
            fs.mkdirSync(badgesDir, { recursive: true });
        }

        // Calculate quadrant dimensions
        const quadW = A4_WIDTH / 2;
        const quadH = A4_HEIGHT / 2;

        // Draw dotted fold lines
        page.drawLine({
            start: { x: quadW, y: 0 },
            end: { x: quadW, y: A4_HEIGHT },
            color: rgb(0.8, 0.8, 0.8),
            dashArray: [5, 5],
        });
        page.drawLine({
            start: { x: 0, y: quadH },
            end: { x: A4_WIDTH, y: quadH },
            color: rgb(0.8, 0.8, 0.8),
            dashArray: [5, 5],
        });

        // --- Carré 1 (haut gauche) : Titre, QR code, logo ---
        const c1_margin_left = 36;
        const c1_margin_right = 36;
        const c1_margin_top = 50;
        const c1_margin_bottom = 20;
        let y1 = A4_HEIGHT - c1_margin_top;
        const titre1 = "CONGRÈS NATIONAL";
        const titre2 = "D'OPTIQUE LUNETTERIE";
        page.drawText(titre1, {
            x: c1_margin_left,
            y: y1,
            size: 16,
            color: rgb(0, 0, 0),
            maxWidth: quadW - c1_margin_left - c1_margin_right,
        });
        page.drawText(titre1, {
            x: c1_margin_left + 0.7,
            y: y1 + 0.7,
            size: 16,
            color: rgb(0, 0, 0),
            maxWidth: quadW - c1_margin_left - c1_margin_right,
        });
        y1 -= 20;
        page.drawText(titre2, {
            x: c1_margin_left,
            y: y1,
            size: 16,
            color: rgb(0, 0, 0),
            maxWidth: quadW - c1_margin_left - c1_margin_right,
        });
        page.drawText(titre2, {
            x: c1_margin_left + 0.7,
            y: y1 + 0.7,
            size: 16,
            color: rgb(0, 0, 0),
            maxWidth: quadW - c1_margin_left - c1_margin_right,
        });
        y1 -= 16;
        page.drawText("Centre de conférences Fm6education - Av. Allal Al Fassi", {
            x: c1_margin_left,
            y: y1,
            size: 7,
            color: rgb(0.2, 0.2, 0.2),
            maxWidth: quadW - c1_margin_left - c1_margin_right,
        });
        y1 -= 10;
        page.drawText("RABAT", {
            x: c1_margin_left,
            y: y1,
            size: 7,
            color: rgb(0.2, 0.2, 0.2),
        });
        y1 -= 16;
        page.drawText("10 OCT. 2025", {
            x: c1_margin_left,
            y: y1,
            size: 10,
            color: rgb(0, 0, 0),
        });
        page.drawText("12 OCT. 2025", {
            x: c1_margin_left + 110,
            y: y1,
            size: 10,
            color: rgb(0, 0, 0),
        });
        y1 -= 12;
        page.drawText("09H00", {
            x: c1_margin_left,
            y: y1,
            size: 7,
            color: rgb(0.2, 0.2, 0.2),
        });
        page.drawText("20H00", {
            x: c1_margin_left + 110,
            y: y1,
            size: 7,
            color: rgb(0.2, 0.2, 0.2),
        });
        y1 -= 18;
        // Affichage du nom et prénom
        page.drawText(userData.name || '', {
            x: c1_margin_left,
            y: y1 - 10,
            size: 12,
            color: rgb(0, 0, 0),
            maxWidth: quadW - c1_margin_left - c1_margin_right,
        });
        // Affichage de 'EXPOSANT INDO' (ou autre)
        const exposantLabel = `EXPOSANT ${userData.exposant ? userData.exposant.toUpperCase() : ''}`;
        page.drawText(exposantLabel, {
            x: c1_margin_left,
            y: y1 - 28,
            size: 11,
            color: rgb(0.1, 0.1, 0.1),
            maxWidth: quadW - c1_margin_left - c1_margin_right,
        });
        // QR code à droite du texte, centré verticalement dans la moitié supérieure du carré 1
        const qrCodeDataUrl = await QRCode.toDataURL(userData.userId);
        const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
        const qrCodeSize = 100;
        const qrCodeX = quadW - qrCodeSize - 20;
        const qrCodeY = quadH + quadH / 2 - qrCodeSize / 2;
        page.drawImage(qrCodeImage, {
            x: qrCodeX,
            y: qrCodeY,
            width: qrCodeSize,
            height: qrCodeSize,
        });
        // Afficher le nom de l'exposant à côté du QR code
        page.drawText(exposantLabel, {
            x: qrCodeX + qrCodeSize + 20,
            y: qrCodeY + qrCodeSize / 2 - 8,
            size: 12,
            color: rgb(0, 0, 0),
            maxWidth: 120,
        });
        // --- Carré 2 (haut droit) : Image affiche CNOL 2025 ---
        try {
            const posterImage = await pdfDoc.embedJpg(fs.readFileSync('public/images/cnol2025-poster.jpg'));
            page.drawImage(posterImage, {
                x: quadW,
                y: quadH,
                width: quadW,
                height: quadH,
            });
        } catch (error) {
            // Ignore if poster not found
        }
        // --- Carré 3 et 4 (bas) : Conseils et conditions d'utilisation ---
        // Conseils d'utilisation (bas gauche)
        const conseils = "Imprimer le badge en couleur, plier en 4 & suivre les pointillés et le présenter à l'accueil du congrès.\nÀ présenter sur le lieu d'événement.\nAttention à ne pas détériorer le QR code afin de bien visible.\nUne pièce d'identité pourra également vous être demandée.";
        const conseilsBox = {
            x: c1_margin_left,
            y: c1_margin_bottom,
            width: quadW - c1_margin_left - c1_margin_right,
            height: quadH / 2,
        };
        page.drawRectangle({
            ...conseilsBox,
            borderColor: rgb(0,0,0),
            borderWidth: 3,
            color: rgb(1,1,1),
        });
        page.drawText(conseils, {
            x: conseilsBox.x + 28,
            y: conseilsBox.y + conseilsBox.height - 40,
            size: 9,
            color: rgb(0, 0, 0),
            maxWidth: conseilsBox.width - 56,
            lineHeight: 13,
        });
        // Conditions d'utilisation (bas droit)
        const conditions = "Ce badge est personnel et non transférable.\nToute reproduction est interdite.\nIl est obligatoire pour accéder à l'espace exposition et conférences.\nLa participation à l'événement vaut acceptation des autorisations de captation photo et vidéo à des fins de communication du CNOL.";
        const conditionsBox = {
            x: quadW + 20,
            y: c1_margin_bottom,
            width: quadW - 40,
            height: quadH / 2,
        };
        page.drawRectangle({
            ...conditionsBox,
            borderColor: rgb(0,0,0),
            borderWidth: 3,
            color: rgb(1,1,1),
        });
        page.drawText(conditions, {
            x: conditionsBox.x + 28,
            y: conditionsBox.y + conditionsBox.height - 40,
            size: 9,
            color: rgb(0, 0, 0),
            maxWidth: conditionsBox.width - 56,
            lineHeight: 13,
        });
        // Save PDF
        const safeName = userData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const fileName = `cnol2025-exposant-${safeName}-${userData.userId}.pdf`;
        const filePath = path.join(badgesDir, fileName);
        fs.writeFileSync(filePath, await pdfDoc.save());
        return filePath;
    } catch (error) {
        throw error;
    }
} 