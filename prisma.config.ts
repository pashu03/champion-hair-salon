import "dotenv/config";
import { defineConfig } from "prisma/config";
import { configureDatabaseUrl } from "./src/lib/database-url";

const database = configureDatabaseUrl();

const usePostgreSQL =
  process.env.VERCEL === "1" ||
  process.env.PRISMA_SCHEMA_PROVIDER === "postgresql" ||
  database.isPostgreSQL;

// `prisma generate` does not connect to the database, but Prisma 6 still
// validates that the URL exists. This placeholder keeps dependency installs
// buildable when Vercel has not received DATABASE_URL yet. Application code
// never uses this value because the config runs only inside Prisma CLI tasks.
if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = usePostgreSQL
    ? "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder"
    : "file:./dev.db";
}

export default defineConfig({
  schema: usePostgreSQL
    ? "./prisma/schema.postgresql.prisma"
    : "./prisma/schema.prisma",
  // Supabase recommends a pooled URL for serverless application traffic and
  // a direct/session URL for migrations. Fall back to DATABASE_URL locally.
  datasource: {
    url: process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL!,
  },
  migrations: {
    path: usePostgreSQL
      ? "./prisma/migrations-postgresql"
      : "./prisma/migrations-sqlite",
    seed: "tsx ./prisma/seed.ts",
  },
});
