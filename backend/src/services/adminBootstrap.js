const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const logger = require("../logger");

const prisma = new PrismaClient();

async function assurerCompteAdmin() {
  const dejaAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (dejaAdmin) return;

  const email = String(process.env.ADMIN_EMAIL || "admin@thetiptop.fr")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      password: hashed,
      firstName: "Admin",
      lastName: "Tip Top",
    },
    create: {
      email,
      password: hashed,
      firstName: "Admin",
      lastName: "Tip Top",
      role: "ADMIN",
    },
  });

  logger.info("Compte administrateur initialisé", { email });
}

module.exports = { assurerCompteAdmin };
