const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authModule = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// La même armure magique que pour users.js
const auth =
  typeof authModule === "function"
    ? authModule
    : authModule.auth ||
      authModule.authMiddleware ||
      authModule.authenticateToken ||
      authModule.authenticate ||
      authModule.verifyToken;

router.post("/validate", auth, async (req, res) => {
  try {
    const { code } = req.body;

    // Récupération sécurisée de l'ID utilisateur
    const userId = req.user?.id || req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    // 1. On cherche le ticket (findFirst est plus souple que findUnique si le schéma a bougé)
    const ticket = await prisma.ticket.findFirst({ where: { code: code } });

    if (!ticket) return res.status(404).json({ error: "Ticket invalide" });
    if (ticket.used)
      return res.status(400).json({ error: "Ticket déjà utilisé" });

    // 2. On cherche les lots dispos
    const lots = await prisma.lot.findMany({ where: { stock: { gt: 0 } } });
    if (lots.length === 0)
      return res.status(500).json({ error: "Plus de lots disponibles" });

    // 3. Tirage au sort
    const lot = lots[Math.floor(Math.random() * lots.length)];

    // 4. Enregistrement de la victoire (CORRIGÉ AVEC CONNECT)
    const [gain] = await prisma.$transaction([
      prisma.gain.create({
        data: {
          userId: userId,
          lotId: lot.id,
          // La syntaxe relationnelle parfaite pour Prisma :
          ticket: { connect: { id: ticket.id } },
        },
        include: { lot: true },
      }),
      // On met à jour avec ticket.id, c'est 100% sûr pour Prisma
      prisma.ticket.update({ where: { id: ticket.id }, data: { used: true } }),
      prisma.lot.update({
        where: { id: lot.id },
        data: { stock: { decrement: 1 } },
      }),
    ]);

    // On s'assure d'utiliser le bon nom de variable (name ou libelle selon ce que Timo a fait)
    res.json({
      message: "Félicitations !",
      gain: gain.lot.name || gain.lot.libelle || "Un superbe lot",
    });
  } catch (error) {
    console.error("Erreur validation ticket :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.get("/my-gains", auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId || req.user?.userId;
    const gains = await prisma.gain.findMany({
      where: { userId: userId },
      include: { lot: true },
    });
    res.json(gains);
  } catch (error) {
    console.error("Erreur my-gains :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

module.exports = router;
