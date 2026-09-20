const crypto = require("crypto");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { validatePassword } = require("../utils/password");
const {
  activerAbonnement,
  emailValide,
  normaliserEmail,
} = require("../services/newsletter");
const { verifierCredentialGoogle } = require("../services/googleAuth");

const router = express.Router();
const prisma = new PrismaClient();

function reponseAuth(res, user) {
  const token = jwt.sign(
    { id: user.id, userId: user.id, role: user.role },
    process.env.JWT_SECRET || "dev-secret-change-me",
    { expiresIn: "24h" },
  );

  return res.json({
    token,
    role: user.role,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
}

router.post("/register", async (req, res) => {
  const email = normaliserEmail(req.body.email);
  const { password, firstName, lastName, newsletter } = req.body;

  if (!emailValide(email)) {
    return res.status(400).json({ error: "Adresse e-mail invalide." });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        newsletter: Boolean(newsletter),
      },
    });

    if (newsletter) {
      try {
        await activerAbonnement(email);
      } catch (erreurNewsletter) {
        console.error("Newsletter à l'inscription:", erreurNewsletter);
      }
    }

    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    console.error("Register:", e);
    res.status(500).json({ error: "Impossible de créer le compte." });
  }
});

router.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const { password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    return reponseAuth(res, user);
  } catch (erreur) {
    console.error("Login:", erreur);
    res.status(503).json({
      error: "Base de données indisponible. Vérifiez que PostgreSQL est démarré.",
    });
  }
});

router.post("/google", async (req, res) => {
  try {
    const profil = await verifierCredentialGoogle(req.body.credential);
    let user = await prisma.user.findUnique({
      where: { email: profil.email },
    });

    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            email: profil.email,
            password: await bcrypt.hash(
              crypto.randomBytes(32).toString("hex"),
              10,
            ),
            firstName: profil.firstName,
            lastName: profil.lastName,
          },
        });
      } catch (erreurCreation) {
        if (erreurCreation.code !== "P2002") {
          throw erreurCreation;
        }
        user = await prisma.user.findUnique({
          where: { email: profil.email },
        });
      }
    }

    if (!user) {
      return res.status(500).json({
        error: "Impossible de se connecter avec Google.",
      });
    }

    return reponseAuth(res, user);
  } catch (erreur) {
    if (erreur.status) {
      return res.status(erreur.status).json({ error: erreur.message });
    }
    console.error("Google auth:", erreur);
    return res.status(500).json({
      error: "Impossible de se connecter avec Google.",
    });
  }
});

module.exports = router;
