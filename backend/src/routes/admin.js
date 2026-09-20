const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { genererCodeTicket } = require('../utils/ticketCode');
const { validatePassword } = require('../utils/password');
const { emailValide, normaliserEmail } = require('../services/newsletter');

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

router.get('/gains', authMiddleware, requireRole('EMPLOYEE', 'ADMIN'), async (req, res) => {
  try {
    const gains = await prisma.gain.findMany({
      include: {
        lot: { select: { name: true } },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { wonAt: 'desc' },
    });

    res.json({
      gains: gains.map((gain) => ({
        id: gain.id,
        prize: gain.lot?.name || 'Lot',
        code: gain.ticketCode,
        claimed: gain.claimed,
        wonAt: gain.wonAt,
        firstName: gain.user?.firstName || 'Cher',
        lastName: gain.user?.lastName || 'Client',
        email: gain.user?.email || '',
      })),
    });
  } catch (erreur) {
    console.error('Liste des gains :', erreur);
    res.status(500).json({ error: 'Impossible de charger les gagnants.' });
  }
});

router.get('/gain/:code', authMiddleware, requireRole('EMPLOYEE', 'ADMIN'), async (req, res) => {
  const gain = await prisma.gain.findUnique({
    where: { ticketCode: req.params.code },
    include: {
      lot: true,
      user: { select: { email: true, firstName: true, lastName: true } },
    },
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

function resumeEmploye(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
  };
}

router.get('/employes', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  const employes = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ employes });
});

router.post('/employes', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  const email = normaliserEmail(req.body.email);
  const password = req.body.password;
  const firstName = String(req.body.firstName || '').trim() || 'Employe';
  const lastName = String(req.body.lastName || '').trim() || 'Boutique';

  if (!emailValide(email)) {
    return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  }

  try {
    const existant = await prisma.user.findUnique({ where: { email } });

    if (existant?.role === 'ADMIN') {
      return res.status(400).json({
        error: 'Impossible de transformer un administrateur en employé.',
      });
    }

    if (!existant && !password) {
      return res.status(400).json({
        error: 'Indiquez un mot de passe pour créer ce compte.',
      });
    }

    const donnees = {
      role: 'EMPLOYEE',
    };

    if (password) {
      const erreurMotDePasse = validatePassword(password);
      if (erreurMotDePasse) {
        return res.status(400).json({ error: erreurMotDePasse });
      }
      donnees.password = await bcrypt.hash(password, 10);
    }

    if (!existant) {
      donnees.firstName = firstName;
      donnees.lastName = lastName;
    }

    const user = existant
      ? await prisma.user.update({
          where: { email },
          data: donnees,
        })
      : await prisma.user.create({
          data: { email, ...donnees },
        });

    res.status(existant ? 200 : 201).json({
      employe: resumeEmploye(user),
      cree: !existant,
      message: existant
        ? `${user.email} peut maintenant se connecter sur /employe.`
        : `Compte créé : ${user.email}. Connexion sur /employe.`,
    });
  } catch (erreur) {
    console.error('Création employé :', erreur);
    res.status(500).json({ error: 'Impossible de créer le compte employé.' });
  }
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