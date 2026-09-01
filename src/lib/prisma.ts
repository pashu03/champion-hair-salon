import { PrismaClient } from "@prisma/client";
import { configureDatabaseUrl } from "./database-url";

// Vercel database integrations do not all use the same environment-variable
// name. Normalize them before Prisma reads its datasource configuration.
configureDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
