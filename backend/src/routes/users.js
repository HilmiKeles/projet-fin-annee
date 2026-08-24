const express = require("express");
const router = express.Router();
const authModule = require("../middleware/auth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Résolution automatique du middleware (supporte export fonction ou objet)
const auth =
  typeof authModule === "function"
    ? authModule
    : authModule.auth ||
      authModule.authMiddleware ||
      authModule.authenticateToken ||
      authModule.authenticate ||
      authModule.verifyToken;

// Route GET /api/users/me
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // 1. Chercher l'utilisateur complet sans "select" restrictif
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Sécurité : suppression manuelle du mot de passe
    delete user.password;
    delete user.motDePasse;
    delete user.motDePasseHache;

    // 2. Chercher ses participations / tickets
    const participations = await prisma.ticket.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    // 3. Traduction à la volée pour que le profil React s'affiche correctement
    const userFormatte = {
      ...user,
      firstName: user.prenom || user.firstName || "Cher",
      lastName: user.nom || user.lastName || "Client",
    };

    // Envoyer la réponse finale au Front-end
    res.json({ user: userFormatte, participations });
  } catch (error) {
    console.error("Erreur route /users/me :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

module.exports = router;
