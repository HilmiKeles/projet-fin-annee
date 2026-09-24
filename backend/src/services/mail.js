const nodemailer = require("nodemailer");

function urlApplication() {
  const brute = String(
    process.env.PUBLIC_APP_URL || process.env.SITE_ADDRESS || "http://localhost",
  ).trim();
  const avecScheme = /^https?:\/\//i.test(brute) ? brute : `https://${brute}`;
  return avecScheme.replace(/\/$/, "");
}

function creerTransport() {
  const host = String(process.env.SMTP_HOST || "").trim();
  if (!host) {
    const erreur = new Error(
      "Impossible d'envoyer l'e-mail : aucun serveur SMTP n'est configuré.",
    );
    erreur.status = 503;
    throw erreur;
  }

  const options = {
    host,
    port: Number(process.env.SMTP_PORT || 1025),
    secure: process.env.SMTP_SECURE === "true",
  };

  const user = String(process.env.SMTP_USER || "").trim();
  if (user) {
    options.auth = {
      user,
      pass: process.env.SMTP_PASS || "",
    };
  }

  return nodemailer.createTransport(options);
}

async function envoyerEmail({ to, subject, text, html }) {
  const transport = creerTransport();

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || "Thé Tip Top <noreply@thetiptop.fr>",
      to,
      subject,
      text,
      html,
    });
  } catch (erreur) {
    console.error("Envoi e-mail:", erreur);
    const echec = new Error("Impossible d'envoyer l'e-mail pour le moment.");
    echec.status = 503;
    throw echec;
  }
}

module.exports = { envoyerEmail, urlApplication };
