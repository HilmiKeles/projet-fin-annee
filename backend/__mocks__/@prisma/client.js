const prisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  newsletterSubscriber: {
    upsert: jest.fn(),
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
  ticket: {
    findFirst: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
  lot: {
    findMany: jest.fn(),
    update: jest.fn(),
  },
  gain: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((operations) => Promise.all(operations)),
};

function PrismaClient() {
  return prisma;
}

module.exports = { PrismaClient, prisma };
