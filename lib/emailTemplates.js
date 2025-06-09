// lib/emailTemplates.js

// 1. Inscription reçue (badge visiteur – en attente de validation)
export function registrationReceivedTemplate({ name }) {
  return {
    subject: 'CNOL 2025 – Inscription reçue',
    text: `Bonjour ${name},\n\nVotre inscription a bien été enregistrée. Elle sera validée sous 48h.`,
    html: `<p>Bonjour <b>${name}</b>,<br><br>Votre inscription a bien été enregistrée.<br>Elle sera validée sous 48h.</p>`
  };
}

// 2. Inscription validée + badge
export function registrationValidatedTemplate({ name, pin, badgeUrl }) {
  return {
    subject: 'CNOL 2025 – Inscription validée ✅',
    text: `Bonjour ${name},\n\nVotre inscription est validée !\nVotre code PIN : ${pin}\nAccédez à votre badge ici : ${badgeUrl}`,
    html: `<p>Bonjour <b>${name}</b>,<br><br>Votre inscription est validée !<br><b>Code PIN :</b> ${pin}<br><a href="${badgeUrl}">Accédez à votre badge</a></p>`
  };
}

// 3. Réservation atelier/masterclass
export function workshopReservationTemplate({ name, title, date, heure, lieu, ticketUrl }) {
  return {
    subject: 'CNOL 2025 – Réservation confirmée',
    text: `Bonjour ${name},\n\nVotre réservation pour l'atelier/masterclass « ${title} » est confirmée.\nDate : ${date} à ${heure}\nLieu : ${lieu}\nTéléchargez votre ticket : ${ticketUrl}`,
    html: `<p>Bonjour <b>${name}</b>,<br><br>Votre réservation pour l'atelier/masterclass <b>${title}</b> est confirmée.<br>Date : ${date} à ${heure}<br>Lieu : ${lieu}<br><a href="${ticketUrl}">Télécharger mon ticket</a></p>`
  };
}

// 4. Candidature CNOL d'Or reçue
export function cnolDorReceivedTemplate({ name, categorie, ficheUrl }) {
  return {
    subject: 'CNOL d\'Or – Candidature bien reçue',
    text: `Bonjour ${name},\n\nVotre candidature dans la catégorie « ${categorie} » a bien été reçue.\nAccédez à votre espace : ${ficheUrl}`,
    html: `<p>Bonjour <b>${name}</b>,<br><br>Votre candidature dans la catégorie <b>${categorie}</b> a bien été reçue.<br><a href="${ficheUrl}">Accéder à mon espace</a></p>`
  };
}

// 5. Ajout d'un staff exposant (déjà utilisé)
export function staffBadgeTemplate({ name, exposant, badgeUrl }) {
  return {
    subject: `Votre badge CNOL 2025 – ${exposant}`,
    text: `Bonjour ${name},\n\nVous trouverez ci-joint votre badge staff pour le CNOL 2025.\nTéléchargez-le ici : ${badgeUrl}\n\nLieu : Centre de conférences Fm6education, Rabat\nDates : 10-12 octobre 2025`,
    html: `<p>Bonjour <b>${name}</b>,<br><br>Vous trouverez ci-joint votre badge staff pour le CNOL 2025.<br><a href="${badgeUrl}">Télécharger mon badge</a><br><br>Lieu : Centre de conférences Fm6education, Rabat<br>Dates : 10-12 octobre 2025</p>`
  };
}
