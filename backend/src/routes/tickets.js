const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/validate', authMiddleware, async (req, res) => {
  const { code } = req.body;

  const ticket = await prisma.ticket.findUnique({ where: { code } });
  if (!ticket) return res.status(404).json({ error: 'Ticket invalide' });
  if (ticket.used) return res.status(400).json({ error: 'Ticket déjà utilisé' });

  const lots = await prisma.lot.findMany({ where: { stock: { gt: 0 } } });
  if (lots.length === 0) return res.status(500).json({ error: 'Plus de lots disponibles' });

  const lot = lots[Math.floor(Math.random() * lots.length)];

  const [gain] = await prisma.$transaction([
    prisma.gain.create({
      data: { userId: req.user.id, ticketCode: code, lotId: lot.id },
      include: { lot: true }
    }),
    prisma.ticket.update({ where: { code }, data: { used: true } }),
    prisma.lot.update({ where: { id: lot.id }, data: { stock: { decrement: 1 } } })
  ]);

  res.json({ message: 'Félicitations !', gain: gain.lot.name });
});

router.get('/my-gains', authMiddleware, async (req, res) => {
  const gains = await prisma.gain.findMany({
    where: { userId: req.user.id },
    include: { lot: true }
  });
  res.json(gains);
});

module.exports = router;