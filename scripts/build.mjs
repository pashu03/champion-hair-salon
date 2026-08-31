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

const hasDatabase = Boolean(process.env.DATABASE_URL?.trim());
const usesPostgreSQL =
  process.env.VERCEL === "1" ||
  process.env.PRISMA_SCHEMA_PROVIDER === "postgresql";

if (hasDatabase) {
  run(prismaCli, ["generate"]);
  if (usesPostgreSQL) run(prismaCli, ["migrate", "deploy"]);
} else if (usesPostgreSQL) {
  console.warn(
    "DATABASE_URL is not configured; building public pages with static fallback data."
  );
}

run(nextCli, ["build"]);
