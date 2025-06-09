import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A4 dimensions in points (72 points = 1 inch)
const A4_WIDTH = 595.28;  // 210mm
const A4_HEIGHT = 841.89; // 297mm

export async function generateBadge(userData) {
    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]); // Portrait orientation

        // Ensure badges directory exists
        const badgesDir = path.join(process.cwd(), 'public', 'badges');
        if (!fs.existsSync(badgesDir)) {
            console.log('Creating badges directory:', badgesDir);
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

        // --- Carré 1 (haut gauche) : Titre très gras, QR code à droite du texte ---
        const c1_margin_left = 36;
        const c1_margin_right = 36;
        const c1_margin_top = 50;
        const c1_margin_bottom = 20;
        const c1_text_zone_height = quadH * 0.6 - c1_margin_top;
        let y1 = A4_HEIGHT - c1_margin_top;
        // Titre principal très gras (simulé)
        const titre1 = "CONGRÈS NATIONAL";
        const titre2 = "D'OPTIQUE LUNETTERIE";
        // Simuler le gras en dessinant deux fois avec un léger décalage
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
        // Dates (2 colonnes)
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
        // Horaires (2 colonnes)
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
        // Nom et fonction ou type
        let fonctionAffichee = userData.function ? userData.function.toUpperCase() : '';
        if (userData.type === 'exposant') {
            fonctionAffichee = 'EXPOSANT';
        }
        page.drawText(`${userData.name} ${fonctionAffichee}`, {
            x: c1_margin_left,
            y: y1,
            size: 12,
            color: rgb(0, 0, 0),
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
        // Logo exposant à droite du QR code si fourni
        if (userData.type === 'exposant' && userData.logoFileName) {
            try {
                const logoPath = path.join(process.cwd(), 'public', 'images', userData.logoFileName);
                console.log('Tentative de chargement du logo depuis:', logoPath);
                
                if (!fs.existsSync(logoPath)) {
                    console.error('Logo exposant non trouvé :', logoPath);
                } else {
                    // Lire le fichier
                    const logoBytes = fs.readFileSync(logoPath);
                    console.log('Logo lu, taille:', logoBytes.length, 'bytes');
                    
                    // Essayer d'embarquer l'image
                    let logoImage;
                    try {
                        logoImage = await pdfDoc.embedPng(logoBytes);
                        console.log('Logo chargé en PNG avec succès');
                    } catch (pngError) {
                        console.error('Erreur lors du chargement du PNG:', pngError);
                        throw pngError;
                    }
                    
                    console.log('Dimensions du logo:', logoImage.width, 'x', logoImage.height);
                    
                    // Calculer les dimensions pour maintenir le ratio
                    const maxLogoSize = 120; // Augmenté à 120px
                    const logoWidth = logoImage.width;
                    const logoHeight = logoImage.height;
                    const ratio = Math.min(maxLogoSize / logoWidth, maxLogoSize / logoHeight);
                    const logoSize = {
                        width: logoWidth * ratio,
                        height: logoHeight * ratio
                    };
                    
                    // Positionner le logo à droite du QR code
                    const logoX = qrCodeX + qrCodeSize + 40; // Augmenté à 40px
                    const logoY = qrCodeY + (qrCodeSize - logoSize.height) / 2;
                    
                    console.log('Position du logo:', { x: logoX, y: logoY });
                    console.log('Taille du logo:', logoSize);
                    
                    // Dessiner d'abord un rectangle de fond blanc
                    page.drawRectangle({
                        x: logoX - 5,
                        y: logoY - 5,
                        width: logoSize.width + 10,
                        height: logoSize.height + 10,
                        color: rgb(1, 1, 1),
                    });
                    
                    // Dessiner un rectangle rouge pour le débogage
                    page.drawRectangle({
                        x: logoX - 5,
                        y: logoY - 5,
                        width: logoSize.width + 10,
                        height: logoSize.height + 10,
                        borderColor: rgb(1, 0, 0),
                        borderWidth: 2,
                    });
                    
                    // Dessiner le logo avec une nouvelle approche
                    try {
                        console.log('Tentative de dessiner le logo...');
                        page.drawImage(logoImage, {
                            x: logoX,
                            y: logoY,
                            width: logoSize.width,
                            height: logoSize.height,
                        });
                        console.log('Logo dessiné avec succès');
                    } catch (drawError) {
                        console.error('Erreur lors du dessin du logo:', drawError);
                        throw drawError;
                    }
                    
                    console.log('Logo exposant ajouté avec succès');
                }
            } catch (e) {
                console.error('Erreur détaillée lors de l\'ajout du logo exposant :', e);
            }
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
            color: rgb(0, 0, 0),
            maxWidth: c3_box_w - 2 * conseilsPaddingX,
        });
        y3 -= conseilsTitreSize + 8;
        for (const ligne of conseilsLignes) {
            page.drawText(ligne, {
                x: c3_box_x + conseilsPaddingX,
                y: y3,
                size: conseilsTextSize,
                color: rgb(0.2, 0.2, 0.2),
                maxWidth: c3_box_w - 2 * conseilsPaddingX,
            });
            y3 -= conseilsLineHeight;
        }

        // --- Carré 4 (bas droit) : Encadrement ajusté à la hauteur du texte, largeur augmentée ---
        const conditionsTitre = "Condition d'utilisation";
        const conditionsLignes = [
            "Ce badge est personnel et non transférable.",
            "Toute reproduction est interdite.",
            "Il est obligatoire pour accéder à l'espace exposition et",
            "conférences générales.",
            "Ce badge ne donne pas accès aux ateliers ni aux masterclass.",
            "La participation à l'événement vaut autorisation de captation",
            "photo et vidéo dans le cadre de la communication du CNOL."
        ];
        const conditionsTitreSize = 10;
        const conditionsTextSize = 8;
        const conditionsLineHeight = 11;
        const conditionsPaddingX = 24;
        const conditionsPaddingY = 14;
        const conditionsBlocHeight = conditionsTitreSize + 8 + conditionsLignes.length * conditionsLineHeight;
        const c4_box_w = quadW - 2 * conditionsPaddingX + 30;
        const c4_box_h = conditionsBlocHeight + 2 * conditionsPaddingY;
        const c4_box_x = quadW + conditionsPaddingX - 15;
        const c4_box_y = quadH / 2 - c4_box_h / 2;
        // Rectangle d'encadrement pour conditions
        page.drawRectangle({
            x: c4_box_x,
            y: c4_box_y,
            width: c4_box_w,
            height: c4_box_h,
            borderColor: rgb(0.2, 0.2, 0.2),
            borderWidth: 1.2,
        });
        // Conditions d'utilisation dans le cadre
        let y4 = c4_box_y + c4_box_h - conditionsPaddingY - conditionsTitreSize;
        page.drawText(conditionsTitre, {
            x: c4_box_x + conditionsPaddingX,
            y: y4,
            size: conditionsTitreSize,
            color: rgb(0, 0, 0),
            maxWidth: c4_box_w - 2 * conditionsPaddingX,
        });
        y4 -= conditionsTitreSize + 8;
        for (const ligne of conditionsLignes) {
            page.drawText(ligne, {
                x: c4_box_x + conditionsPaddingX,
                y: y4,
                size: conditionsTextSize,
                color: rgb(0.2, 0.2, 0.2),
                maxWidth: c4_box_w - 2 * conditionsPaddingX,
            });
            y4 -= conditionsLineHeight;
        }

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const outputPath = path.join(badgesDir, `${userData.userId}.pdf`);
        fs.writeFileSync(outputPath, pdfBytes);
        console.log('✅ Badge successfully generated at:', outputPath);

        return outputPath;
    } catch (error) {
        console.error('❌ Error generating badge:', error);
        throw error;
    }
}

// Test the badge generation
(async () => {
    try {
        await generateBadge({
            name: 'Youssef El Amrani',
            function: 'Opticien',
            city: 'Casablanca',
            email: 'youssef@example.com',
            userId: 'cnol2025-001'
        });
    } catch (err) {
        console.error('❌ Failed to generate badge:', err);
    }
})();
  