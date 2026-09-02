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

const databaseUrl = process.env.DATABASE_URL?.trim() || "";
const hasPostgreSQL = /^(?:postgres(?:ql)?|prisma\+postgres):\/\//i.test(
  databaseUrl
);
const isVercel = process.env.VERCEL === "1";

if (isVercel && !hasPostgreSQL) {
  throw new Error(
    "DATABASE_URL must be a Supabase PostgreSQL connection string on Vercel. " +
      "Set it for this deployment environment, then redeploy. A local SQLite " +
      "file cannot persist application data on Vercel."
  );
}

if (isVercel && !process.env.JWT_SECRET?.trim()) {
  throw new Error(
    "JWT_SECRET is required on Vercel so admin login sessions can be signed securely."
  );
}

run(prismaCli, ["generate"]);

run(nextCli, ["build"]);
