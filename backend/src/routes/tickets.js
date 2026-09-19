const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authModule = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

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

    const userId = req.user?.id || req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const ticket = await prisma.ticket.findFirst({ where: { code: code } });

    if (!ticket) return res.status(404).json({ error: "Ticket invalide" });
    if (ticket.used)
      return res.status(400).json({ error: "Ticket déjà utilisé" });

    const lots = await prisma.lot.findMany({ where: { stock: { gt: 0 } } });
    if (lots.length === 0)
      return res.status(500).json({ error: "Plus de lots disponibles" });

    const lot = lots[Math.floor(Math.random() * lots.length)];

    const [gain] = await prisma.$transaction([
      prisma.gain.create({
        data: {
          user: { connect: { id: userId } },
          lot: { connect: { id: lot.id } },
          ticket: { connect: { code: ticket.code } },
        },
        include: { lot: true },
      }),
      prisma.ticket.update({
        where: { code: ticket.code },
        data: { used: true },
      }),
      prisma.lot.update({
        where: { id: lot.id },
        data: { stock: { decrement: 1 } },
      }),
    ]);

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
