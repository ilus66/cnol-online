import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { generateBadge } from '../../generateBadge.js';
import { sendBadgeEmail } from '../../sendEmail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, ...userData } = req.body;
    const userId = uuidv4();
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save user data
    const usersPath = path.join(dataDir, 'users.json');
    let users = [];
    if (fs.existsSync(usersPath)) {
      users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    }

    const newUser = {
      id: userId,
      type,
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

    // Generate badge
    const badgePath = await generateBadge({
      ...userData,
      userId,
      type
    });

    // Send confirmation email with badge
    await sendBadgeEmail({
      ...userData,
      userId,
      badgeUrl: `/badges/${path.basename(badgePath)}`
    });

    res.status(200).json({ 
      message: 'Inscription réussie',
      userId,
      badgeUrl: `/badges/${path.basename(badgePath)}`
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
} 