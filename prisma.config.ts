import "dotenv/config";
import { defineConfig } from "prisma/config";

const usePostgreSQL =
  process.env.VERCEL === "1" ||
  process.env.PRISMA_SCHEMA_PROVIDER === "postgresql";

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
