const logger = require("../logger");

// Noms acceptés pour la case à cocher invisible côté formulaires.
const CHAMPS_PIEGES = ["confirmationHumaine", "confirmation_humaine"];

const VALEURS_COCHEES = new Set(["true", "on", "1", "yes", "oui", "checked"]);

function estCoche(valeur) {
  if (typeof valeur === "boolean") return valeur;
  if (typeof valeur === "number") return valeur !== 0;
  if (typeof valeur === "string") {
    return VALEURS_COCHEES.has(valeur.trim().toLowerCase());
  }
  return false;
}

/**
 * Refuse les requêtes dont la case à cocher piège est cochée.
 * Les humains ne voient pas ce champ : seule une soumission automatisée
 * le remplit, l'accès est donc refusé (403).
 */
function honeypotMiddleware(req, res, next) {
  const corps = req.body;

  if (!corps || typeof corps !== "object") {
    return next();
  }

  const champPiege = CHAMPS_PIEGES.find((champ) => estCoche(corps[champ]));

  if (champPiege) {
    logger.warn("Requête bloquée par le piège anti-robot", {
      route: req.path,
      method: req.method,
      ip: req.ip,
      champ: champPiege,
    });
    return res.status(403).json({ error: "Accès refusé." });
  }

  return next();
}

module.exports = { honeypotMiddleware, estCoche, CHAMPS_PIEGES };
