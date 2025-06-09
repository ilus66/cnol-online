import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const logPath = path.join(process.cwd(), 'data', 'scan-log.json');
    if (!fs.existsSync(logPath)) {
      return res.status(404).json({ message: 'Aucun log à exporter' });
    }
    const logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    // Générer le CSV
    let csv = 'date,qrData,type,nom,prenom,email\n';
    for (const entry of logs) {
      const { date, qrData, user } = entry;
      csv += `"${date}","${qrData}","${user.type || ''}","${user.nom || ''}","${user.prenom || ''}","${user.email || ''}"
`;
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="scan-log.csv"');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting scan log:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
} 