require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { validatePassword } = require("../utils/password");

const prisma = new PrismaClient();

async function main() {
  const email = String(process.argv[2] || "")
    .trim()
    .toLowerCase();
  const password = process.argv[3];

  if (!email || !password) {
    console.error(
      "Usage: node src/scripts/promouvoirEmploye.js email@domaine.fr MotDePasse1!",
    );
    process.exit(1);
  }

  const erreurMotDePasse = validatePassword(password);
  if (erreurMotDePasse) {
    console.error(erreurMotDePasse);
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: "EMPLOYEE",
      password: hashed,
    },
    create: {
      email,
      password: hashed,
      firstName: "Employe",
      lastName: "Boutique",
      role: "EMPLOYEE",
    },
  });

  console.log(`Compte employé prêt : ${user.email}`);
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
