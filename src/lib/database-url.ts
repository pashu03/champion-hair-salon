const DATABASE_URL_KEYS = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

type DatabaseEnvironment = Record<string, string | undefined>;

export interface DatabaseConfiguration {
  configured: boolean;
  source: (typeof DATABASE_URL_KEYS)[number] | null;
  isPostgreSQL: boolean;
}

/**
 * Normalizes the connection variables exposed by common Vercel Postgres
 * integrations to the DATABASE_URL name expected by the Prisma schema.
 */
export function configureDatabaseUrl(
  environment: DatabaseEnvironment = process.env
): DatabaseConfiguration {
  const source = DATABASE_URL_KEYS.find(
    (key) => Boolean(environment[key]?.trim())
  );
  const value = source ? environment[source]?.trim() || "" : "";

  if (value && !environment.DATABASE_URL?.trim()) {
    environment.DATABASE_URL = value;
  }

  return {
    configured: Boolean(value),
    source: source || null,
    isPostgreSQL: /^(?:postgres(?:ql)?|prisma\+postgres):\/\//i.test(value),
  };
}

