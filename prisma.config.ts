import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma validates the datasource while generating its client, even though
// generation does not connect to PostgreSQL. This unreachable CLI-only value
// allows dependency installation before Vercel injects the real DATABASE_URL.
const databaseUrl =
  process.env.DIRECT_URL?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  "postgresql://placeholder:placeholder@configuration-required.invalid:5432/champion-hair-salon";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    path: "./prisma/migrations-postgresql",
    seed: "tsx ./prisma/seed.ts",
  },
});
