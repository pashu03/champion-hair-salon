type DatabaseEnvironment = Record<string, string | undefined>;

export interface DatabaseConfiguration {
  configured: boolean;
  isPostgreSQL: boolean;
}

export function getDatabaseConfiguration(
  environment: DatabaseEnvironment = process.env
): DatabaseConfiguration {
  const value = environment.DATABASE_URL?.trim() || "";

  return {
    configured: Boolean(value),
    isPostgreSQL: /^(?:postgres(?:ql)?|prisma\+postgres):\/\//i.test(value),
  };
}
