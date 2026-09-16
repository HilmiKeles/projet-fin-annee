const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normaliserEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function emailValide(email) {
  return EMAIL_REGEX.test(normaliserEmail(email));
}

async function activerAbonnement(email) {
  const adresse = normaliserEmail(email);

  await prisma.newsletterSubscriber.upsert({
    where: { email: adresse },
    create: { email: adresse, consent: true },
    update: { consent: true, unsubscribedAt: null },
  });

  await prisma.user.updateMany({
    where: { email: adresse },
    data: { newsletter: true },
  });
}

async function desactiverAbonnement(email) {
  const adresse = normaliserEmail(email);

  await prisma.newsletterSubscriber.updateMany({
    where: { email: adresse, unsubscribedAt: null },
    data: { unsubscribedAt: new Date() },
  });

  await prisma.user.updateMany({
    where: { email: adresse },
    data: { newsletter: false },
  });
}

module.exports = {
  normaliserEmail,
  emailValide,
  activerAbonnement,
  desactiverAbonnement,
};
