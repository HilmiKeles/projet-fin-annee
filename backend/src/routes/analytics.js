const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { estCtaAutorise } = require("../utils/kpis");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/cta", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  if (!estCtaAutorise(name)) {
    return res.status(400).json({ error: "CTA inconnu." });
  }

  try {
    await prisma.ctaClick.create({ data: { name } });
    res.status(201).json({ ok: true });
  } catch (erreur) {
    console.error("Enregistrement CTA :", erreur);
    res.status(500).json({ error: "Impossible d'enregistrer le clic." });
  }
});

module.exports = router;
