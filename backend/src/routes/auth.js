const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  const { email, password, gender, birthDate } = req.body;

  if (!password || password.length < 8) {
  return res.status(400).json({
    error: 'Le mot de passe doit contenir au moins 8 caractères.'
  });
}

if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]';`~]/.test(password)) {
  return res.status(400).json({
    error: 'Le mot de passe doit contenir au moins un caractère spécial.'
  });
}


  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, gender, birthDate: birthDate ? new Date(birthDate) : null }
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    res.status(400).json({ error: 'Email déjà utilisé' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, role: user.role });
});

module.exports = router;