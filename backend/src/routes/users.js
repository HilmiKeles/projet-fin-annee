const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const authModule = require("../middleware/auth");
const { validatePassword } = require("../utils/password");

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

const { identifiantUtilisateur } = require("../utils/identite");

function formaterParticipations(gains) {
  return gains.map((g) => ({
    id: g.id,
    prize: g.lot?.name || g.lot?.libelle || "Lot",
    code: g.ticketCode,
    claimed: g.claimed,
    playedAt: g.wonAt,
  }));
}

router.get("/me", auth, async (req, res) => {
  try {
    const userId = identifiantUtilisateur(req);

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    delete user.password;

    const gains = await prisma.gain.findMany({
      where: { userId: userId },
      include: {
        lot: true,
      },
      orderBy: { wonAt: "desc" },
    });

    const participations = formaterParticipations(gains);
    const aRetirer = participations.filter((p) => !p.claimed).length;

    const userFormatte = {
      ...user,
      firstName: user.prenom || user.firstName || "Cher",
      lastName: user.nom || user.lastName || "Client",
    };

    res.json({
      user: userFormatte,
      participations,
      gains: participations,
      resume: {
        total: participations.length,
        aRetirer,
        remis: participations.length - aRetirer,
      },
    });
  } catch (error) {
    console.error("Erreur route /users/me :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

router.patch("/me/password", auth, async (req, res) => {
  try {
    const userId = identifiantUtilisateur(req);
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Mot de passe actuel et nouveau mot de passe requis.",
      });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect." });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({
        error: "Le nouveau mot de passe doit être différent de l'actuel.",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: "Mot de passe mis à jour." });
  } catch (error) {
    console.error("Erreur changement mot de passe :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    const userId = identifiantUtilisateur(req);
    const { password } = req.body || {};

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (!password) {
      return res.status(400).json({
        error: "Le mot de passe est requis pour supprimer le compte.",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    if (user.role === "ADMIN") {
      return res.status(403).json({
        error:
          "Le compte administrateur ne peut pas être supprimé depuis cette page.",
      });
    }

    await prisma.$transaction([
      prisma.gain.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    res.json({ message: "Compte supprimé." });
  } catch (error) {
    console.error("Erreur suppression compte :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

module.exports = router;
