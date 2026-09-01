import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis;

// Pool de conexiones ajustado a recursos de Render free tier:
// limita el número de conexiones a Postgres para no agotar el límite
// (pg default 10; el free tier de Postgres de Render es más bajo).
// idleTimeoutMillis conserva el defecto de Prisma v6 (~300s).
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PRISMA_CONNECTION_LIMIT) || 5,
  idleTimeoutMillis: 300_000,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
