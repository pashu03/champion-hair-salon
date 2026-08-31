import "dotenv/config";
import { defineConfig } from "prisma/config";

const usePostgreSQL =
  process.env.VERCEL === "1" ||
  process.env.PRISMA_SCHEMA_PROVIDER === "postgresql";

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
  migrations: {
    path: usePostgreSQL
      ? "./prisma/migrations-postgresql"
      : "./prisma/migrations-sqlite",
    seed: "tsx ./prisma/seed.ts",
  },
});
