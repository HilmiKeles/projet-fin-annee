const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { validatePassword } = require("../utils/password");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, newsletter } = req.body;

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    // 2. On insère les vraies données dans la base PostgreSQL
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        newsletter: newsletter || false,
      },
    });

    if (newsletter) {
      await activerAbonnement(email);
    }

    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    res.status(400).json({ error: "Email déjà utilisé" });
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

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "dev-secret-change-me",
      { expiresIn: "24h" },
    );

    res.json({
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
  } catch (erreur) {
    console.error("Login:", erreur);
    res.status(503).json({
      error: "Base de données indisponible. Vérifiez que PostgreSQL est démarré.",
    });
  }
});

module.exports = router;
