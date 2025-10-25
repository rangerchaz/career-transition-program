import { PrismaClient } from '../generated/prisma/client';

// Singleton pattern for Prisma Client to prevent multiple instances
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handler
export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
};
