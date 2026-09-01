import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const prismaCli = fileURLToPath(
  new URL("../node_modules/prisma/build/index.js", import.meta.url)
);
const nextCli = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url)
);

function run(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const databaseUrlKeys = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
];
const databaseUrlKey = databaseUrlKeys.find((key) =>
  Boolean(process.env[key]?.trim())
);
const databaseUrl = databaseUrlKey ? process.env[databaseUrlKey].trim() : "";

if (databaseUrl && !process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = databaseUrl;
}

const hasDatabase = Boolean(databaseUrl);
const hasPostgreSQL = /^(?:postgres(?:ql)?|prisma\+postgres):\/\//i.test(
  databaseUrl
);
const usesPostgreSQL =
  process.env.VERCEL === "1" ||
  process.env.PRISMA_SCHEMA_PROVIDER === "postgresql" ||
  hasPostgreSQL;
const databaseSchemaManagedExternally =
  process.env.DATABASE_SCHEMA_MANAGED_EXTERNALLY === "1";

if (process.env.VERCEL === "1" && (!hasDatabase || !hasPostgreSQL)) {
  throw new Error(
    "A hosted PostgreSQL database is required on Vercel. Connect a Postgres " +
      "integration and expose DATABASE_URL (or POSTGRES_PRISMA_URL / POSTGRES_URL), " +
      "then redeploy. A local file: SQLite URL cannot persist bookings on Vercel."
  );
}

if (process.env.VERCEL === "1" && !process.env.JWT_SECRET?.trim()) {
  throw new Error(
    "JWT_SECRET is required on Vercel so admin login sessions can be signed securely."
  );
}

if (
  process.env.VERCEL === "1" &&
  !databaseSchemaManagedExternally &&
  !process.env.ADMIN_PASSWORD?.trim()
) {
  throw new Error(
    "ADMIN_PASSWORD is required on Vercel so the production admin account can be initialized."
  );
}

if (hasDatabase) {
  run(prismaCli, ["generate"]);
  if (usesPostgreSQL) {
    if (databaseSchemaManagedExternally) {
      console.log(
        "Database schema is managed externally; skipping Prisma migrations and seed."
      );
    } else {
      run(prismaCli, ["migrate", "deploy"]);
      if (process.env.ADMIN_PASSWORD?.trim()) {
        run(prismaCli, ["db", "seed"]);
      }
    }
  }
}

run(nextCli, ["build"]);
