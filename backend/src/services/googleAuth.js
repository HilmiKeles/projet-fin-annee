require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

function erreurHttp(message, status) {
  const erreur = new Error(message);
  erreur.status = status;
  return erreur;
}

async function verifierCredentialGoogle(credential) {
  if (!credential || typeof credential !== "string") {
    throw erreurHttp("Jeton Google manquant.", 400);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw erreurHttp("Connexion Google non configurée.", 503);
  }

  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload() || {};

    if (!payload.email) {
      throw erreurHttp("Jeton Google invalide.", 401);
    }

    if (payload.email_verified === false) {
      throw erreurHttp("Compte Google non vérifié.", 401);
    }

    return {
      email: String(payload.email).trim().toLowerCase(),
      firstName: payload.given_name || "Cher",
      lastName: payload.family_name || "Client",
    };
  } catch (erreur) {
    if (erreur.status) {
      throw erreur;
    }
    throw erreurHttp("Jeton Google invalide.", 401);
  }
}

module.exports = { verifierCredentialGoogle };
