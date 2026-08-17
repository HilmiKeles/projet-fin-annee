const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/stats', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  const [ticketsTotal, ticketsUsed, gains, users] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { used: true } }),
    prisma.gain.findMany({ include: { user: true, lot: true } }),
    prisma.user.count({ where: { role: 'CLIENT' } })
  ]);

  const byGender = gains.reduce((acc, g) => {
    const g2 = g.user.gender || 'inconnu';
    acc[g2] = (acc[g2] || 0) + 1;
    return acc;
  }, {});

  res.json({ ticketsTotal, ticketsUsed, totalGains: gains.length, totalClients: users, gagnantsParSexe: byGender });
});

router.get('/export', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: { email: true, gender: true, birthDate: true }
  });
  res.json(clients);
});

router.get('/gain/:code', authMiddleware, requireRole('EMPLOYEE', 'ADMIN'), async (req, res) => {
  const gain = await prisma.gain.findUnique({
    where: { ticketCode: req.params.code },
    include: { lot: true, user: { select: { email: true } } }
  });
  if (!gain) return res.status(404).json({ error: 'Aucun gain pour ce ticket' });
  res.json(gain);
});

router.patch('/gain/:id/claim', authMiddleware, requireRole('EMPLOYEE', 'ADMIN'), async (req, res) => {
  const gain = await prisma.gain.update({
    where: { id: req.params.id },
    data: { claimed: true }
  });
  res.json({ message: 'Gain marqué comme remis', gain });
});

module.exports = router;