// 🔴 On force le chargement du fichier .env au cas où il ne serait pas encore lu
require("dotenv").config();
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  console.log("\n--- 🕵️‍♂️ VÉRIFICATION DE SÉCURITÉ ---");
  console.log(
    "1. Header reçu :",
    req.headers.authorization ? "Oui" : "Non (ou vide)",
  );
  console.log(
    "2. Clé secrète dispo ? :",
    process.env.JWT_SECRET ? "Oui" : "Non ⚠️",
  );

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("❌ Rejet : Aucun token trouvé dans la requête.");
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-change-me");
    next();
  } catch (err) {
    // C'est ICI qu'on va enfin savoir la vérité !
    console.error("❌ Rejet (Token invalide) :", err.message);
    return res.status(401).json({ error: "Token invalide" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log("❌ Rejet : Rôle insuffisant.");
      return res.status(403).json({ error: "Accès refusé" });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
