// To commuinate with the db ,need to create a prisma instance

import { PrismaClient } from "@/generated/prisma";

export const db = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Override connection pool settings for development
  ...(process.env.NODE_ENV === 'development' && {
    datasources: {
      db: {
        url: process.env.DATABASE_URL?.replace('connection_limit=1', 'connection_limit=5'),
      },
    },
  }),
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.
