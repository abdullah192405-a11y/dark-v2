// To commuinate with the db ,need to create a prisma instance

import { PrismaClient } from "@/generated/prisma";

const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
};

// Function to handle database URL with connection pooling settings
const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL || "";
  
  // If using Supabase pooler (port 6543), ensure pgbouncer=true is present
  if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
    url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
  }
  
  // Explicitly set connection limits and timeouts to prevent pool exhaustion
  // 5 is usually enough for a single dev machine, 20 is a safe default for production
  const limit = process.env.NODE_ENV === 'development' ? 5 : 20;
  const timeout = 30; // 30 seconds wait for a connection
  
  if (!url.includes('connection_limit=')) {
    url += (url.includes('?') ? '&' : '?') + `connection_limit=${limit}`;
  }
  
  if (!url.includes('pool_timeout=')) {
    url += (url.includes('?') ? '&' : '?') + `pool_timeout=${timeout}`;
  }
  
  return url;
};

const createPrismaClient = () => {
  return new PrismaClient({
    ...prismaClientOptions,
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });
};

export const db = createPrismaClient(); // globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.
