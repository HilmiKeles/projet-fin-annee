const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Génère un code à 10 caractères (lettres majuscules + chiffres)
function genererCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function main() {
  // 1. Création des 5 lots (répartition officielle du cahier des charges)
  const infuseur = await prisma.lot.upsert({
    where: { name: "infuseur" },
    update: {},
    create: { name: "infuseur", stock: 300000 }, // 60% de 500 000
  });
  const detox = await prisma.lot.upsert({
    where: { name: "detox" },
    update: {},
    create: { name: "detox", stock: 100000 }, // 20%
  });
  const signature = await prisma.lot.upsert({
    where: { name: "signature" },
    update: {},
    create: { name: "signature", stock: 50000 }, // 10%
  });
  const coffret39 = await prisma.lot.upsert({
    where: { name: "coffret39" },
    update: {},
    create: { name: "coffret39", stock: 30000 }, // 6%
  });
  const coffret69 = await prisma.lot.upsert({
    where: { name: "coffret69" },
    update: {},
    create: { name: "coffret69", stock: 20000 }, // 4%
  });

  console.log("✅ Lots créés");

  // --- NOUVELLE SÉCURITÉ ---
  // On compte combien il y a de tickets dans la base
  const ticketsExistants = await prisma.ticket.count();

  if (ticketsExistants >= 500000) {
    console.log(
      "🛡️ Sécurité : Les 500 000 tickets sont déjà là. On ignore la génération !",
    );
    return; // Ce 'return' magique stoppe net la fonction main() ici.
  }
  // -------------------------

  // 2. Génération des tickets avec leur gain pré-associé
  //    ⚠️ 500 000 en une fois est lourd : commence par 5 000 pour le dev.
  const NB_TICKETS = 500000;

  // Répartition proportionnelle (mêmes pourcentages)
  const repartition = [
    { lot: infuseur, ratio: 0.6 },
    { lot: detox, ratio: 0.2 },
    { lot: signature, ratio: 0.1 },
    { lot: coffret39, ratio: 0.06 },
    { lot: coffret69, ratio: 0.04 },
  ];

  let compteur = 0;
  for (const { lot, ratio } of repartition) {
    const nb = Math.round(NB_TICKETS * ratio);
    const tickets = [];
    for (let i = 0; i < nb; i++) {
      tickets.push({ code: genererCode(), lotId: lot.id });
    }
    // Insertion par paquets de 1000 pour ne pas saturer Postgres
    for (let i = 0; i < tickets.length; i += 1000) {
      await prisma.ticket.createMany({
        data: tickets.slice(i, i + 1000),
        skipDuplicates: true,
      });
    }
    compteur += nb;
    console.log(`✅ ${nb} tickets pour le lot "${lot.name}"`);
  }
  console.log(`🎉 Total : ${compteur} tickets générés`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
