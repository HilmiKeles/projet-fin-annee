const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { genererCodeTicket } = require('../utils/ticketCode');

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
  const [clients, abonnesNewsletter] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        newsletter: true,
        createdAt: true,
      },
    }),
    prisma.newsletterSubscriber.findMany({
      where: { unsubscribedAt: null },
      select: { email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  res.json({ clients, abonnesNewsletter });
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

router.post('/tickets', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  const quantiteDemandee = Number(req.body?.quantite ?? 1);
  const quantite = Number.isInteger(quantiteDemandee)
    ? quantiteDemandee
    : Number.parseInt(quantiteDemandee, 10);

  if (!Number.isInteger(quantite) || quantite < 1 || quantite > 20) {
    return res.status(400).json({
      error: 'Indiquez un nombre de codes entre 1 et 20.',
    });
  }

  try {
    let lot = await prisma.lot.findFirst({ where: { stock: { gt: 0 } } });
    if (!lot) {
      lot = await prisma.lot.upsert({
        where: { name: "infuseur" },
        update: { stock: 100 },
        create: { name: "infuseur", stock: 100 },
      });
    }

    const codes = [];

    for (let i = 0; i < quantite; i += 1) {
      let ticket = null;

      for (let essai = 0; essai < 8; essai += 1) {
        try {
          ticket = await prisma.ticket.create({
            data: {
              code: genererCodeTicket(),
              used: false,
              lotId: lot.id,
            },
          });
          break;
        } catch (erreurCreation) {
          if (erreurCreation.code !== 'P2002') {
            throw erreurCreation;
          }
        }
      }

      if (!ticket) {
        return res.status(500).json({
          error: 'Impossible de générer un code unique.',
        });
      }

      codes.push(ticket.code);
    }

    res.status(201).json({ codes });
  } catch (erreur) {
    console.error('Création de tickets :', erreur);
    res.status(500).json({ error: 'Impossible de créer les codes.' });
  }
});

module.exports = router;