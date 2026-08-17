const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LOTS = [
  { name: 'Infuseur à thé',                    pct: 60, count: 600 },
  { name: 'Boîte 100g thé détox/infusion',     pct: 20, count: 200 },
  { name: 'Boîte 100g thé signature',          pct: 10, count: 100 },
  { name: 'Coffret découverte 39€',            pct: 6,  count: 60 },
  { name: 'Coffret découverte 69€',            pct: 4,  count: 40 },
];

function genCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function main() {
  // Nettoyage (idempotent)
  await prisma.gain.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.lot.deleteMany();

  // 5 lots avec stock
  for (const lot of LOTS) {
    await prisma.lot.create({ data: { name: lot.name, stock: lot.count } });
  }

  // 1000 tickets uniques
  const codes = new Set();
  while (codes.size < 1000) codes.add(genCode());
  await prisma.ticket.createMany({
    data: [...codes].map(code => ({ code })),
  });

  console.log('✅ 5 lots créés, 1000 tickets générés');
}

main().catch(console.error).finally(() => prisma.$disconnect());