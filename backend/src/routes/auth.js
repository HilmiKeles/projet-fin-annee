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
const { envoyerEmail, urlApplication } = require("../services/mail");

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

const DUREE_JETON_MS = 60 * 60 * 1000;
const MESSAGE_OUBLI =
  "Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé. Il expire dans une heure.";

function hasherJeton(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

router.post("/forgot-password", async (req, res) => {
  const email = normaliserEmail(req.body.email);

  if (!emailValide(email)) {
    return res.status(400).json({ error: "Adresse e-mail invalide." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ message: MESSAGE_OUBLI });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + DUREE_JETON_MS);

    await prisma.passwordReset.deleteMany({ where: { userId: user.id } });
    await prisma.passwordReset.create({
      data: {
        tokenHash: hasherJeton(token),
        expiresAt,
        userId: user.id,
      },
    });

    const lien = `${urlApplication()}/reinitialiser-mot-de-passe?token=${token}`;

    try {
      await envoyerEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe — Thé Tip Top",
        text: [
          "Bonjour,",
          "",
          "Vous avez demandé à réinitialiser votre mot de passe Thé Tip Top.",
          "Ouvrez ce lien pour en choisir un nouveau (il expire dans une heure) :",
          lien,
          "",
          "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.",
        ].join("\n"),
        html: [
          "<p>Bonjour,</p>",
          "<p>Vous avez demandé à réinitialiser votre mot de passe Thé Tip Top.</p>",
          `<p><a href="${lien}">Choisir un nouveau mot de passe</a></p>`,
          "<p>Ce lien expire dans une heure. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>",
        ].join(""),
      });
    } catch (erreurEnvoi) {
      await prisma.passwordReset.deleteMany({ where: { userId: user.id } });
      throw erreurEnvoi;
    }

    return res.json({ message: MESSAGE_OUBLI });
  } catch (erreur) {
    console.error("Mot de passe oublié:", erreur);
    return res.status(erreur.status || 503).json({
      error:
        erreur.status === 503
          ? erreur.message
          : "Impossible de préparer la réinitialisation pour le moment.",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  const token = String(req.body.token || "").trim();
  const { password } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Lien de réinitialisation invalide." });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  try {
    const reset = await prisma.passwordReset.findUnique({
      where: { tokenHash: hasherJeton(token) },
    });

    if (!reset || new Date(reset.expiresAt).getTime() < Date.now()) {
      if (reset) {
        await prisma.passwordReset.delete({ where: { id: reset.id } });
      }
      return res.status(400).json({
        error: "Ce lien est invalide ou a expiré. Demandez-en un nouveau.",
      });
    }

    await prisma.user.update({
      where: { id: reset.userId },
      data: { password: await bcrypt.hash(password, 10) },
    });
    await prisma.passwordReset.deleteMany({ where: { userId: reset.userId } });

    return res.json({ message: "Votre mot de passe a été mis à jour." });
  } catch (erreur) {
    console.error("Réinitialisation:", erreur);
    return res.status(500).json({
      error: "Impossible de modifier le mot de passe.",
    });
  }
});

module.exports = router;
