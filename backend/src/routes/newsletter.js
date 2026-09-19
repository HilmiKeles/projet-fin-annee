const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authMiddleware } = require("../middleware/auth");
const {
  normaliserEmail,
  emailValide,
  activerAbonnement,
  desactiverAbonnement,
} = require("../services/newsletter");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/subscribe", async (req, res) => {
  const email = normaliserEmail(req.body.email);
  const consent = Boolean(req.body.consent);

  if (!emailValide(email)) {
    return res.status(400).json({ error: "Adresse e-mail invalide." });
  }

  if (!consent) {
    return res.status(400).json({
      error: "Le consentement est obligatoire pour s'inscrire à la newsletter.",
    });
  }

  try {
    await activerAbonnement(email);
    res.json({
      message: "Vous êtes inscrit(e) à la newsletter Thé Tip Top.",
    });
  } catch (erreur) {
    console.error("Newsletter subscribe:", erreur);
    res.status(500).json({ error: "Impossible d'enregistrer l'inscription." });
  }
});

router.post("/unsubscribe", async (req, res) => {
  const email = normaliserEmail(req.body.email);

  if (!emailValide(email)) {
    return res.status(400).json({ error: "Adresse e-mail invalide." });
  }

  try {
    await desactiverAbonnement(email);
    res.json({ message: "Vous ne recevrez plus la newsletter." });
  } catch (erreur) {
    console.error("Newsletter unsubscribe:", erreur);
    res.status(500).json({ error: "Impossible de traiter la désinscription." });
  }
});

router.patch("/preference", authMiddleware, async (req, res) => {
  const newsletter = Boolean(req.body.newsletter);

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    if (newsletter) {
      await activerAbonnement(user.email);
    } else {
      await desactiverAbonnement(user.email);
    }

    res.json({ newsletter });
  } catch (erreur) {
    console.error("Newsletter preference:", erreur);
    res.status(500).json({ error: "Impossible de mettre à jour la préférence." });
  }
});

module.exports = router;
