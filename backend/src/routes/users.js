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

    // 1. Chercher l'utilisateur complet
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Sécurité : suppression du mot de passe
    delete user.password;

    // 2. Chercher ses participations via le modèle Gain
    //    (c'est Gain qui porte userId, pas Ticket)
    const gains = await prisma.gain.findMany({
      where: { userId: userId },
      include: {
        ticket: true, // pour récupérer le code du ticket
        lot: true,    // pour récupérer le nom du lot gagné
      },
      orderBy: { wonAt: "desc" },
    });

    // 3. Mapper vers le format attendu par Profil.jsx
    const participations = gains.map((g) => ({
      id: g.id,
      prize: g.lot.name,     // clé du mapping GAINS côté React
      code: g.ticketCode,    // code à 10 caractères du ticket
      claimed: g.claimed,    // lot remis ou non en boutique
      playedAt: g.wonAt,     // date de participation
    }));

    // 4. Traduction des champs nom/prénom pour le front
    const userFormatte = {
      ...user,
      firstName: user.prenom || user.firstName || "Cher",
      lastName: user.nom || user.lastName || "Client",
    };

    res.json({ user: userFormatte, participations });
  } catch (error) {
    console.error("Erreur route /users/me :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

module.exports = router;