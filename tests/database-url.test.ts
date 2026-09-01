import { describe, expect, it } from "vitest";
import { configureDatabaseUrl } from "../src/lib/database-url";

describe("database URL configuration", () => {
  it("uses DATABASE_URL when it is configured", () => {
    const environment = {
      DATABASE_URL: "postgresql://primary.example/salon",
      POSTGRES_URL: "postgresql://fallback.example/salon",
    };

    expect(configureDatabaseUrl(environment)).toEqual({
      configured: true,
      source: "DATABASE_URL",
      isPostgreSQL: true,
    });
    expect(environment.DATABASE_URL).toBe(
      "postgresql://primary.example/salon"
    );
  });

  it("normalizes Vercel Postgres aliases for Prisma", () => {
    const environment: Record<string, string | undefined> = {
      POSTGRES_PRISMA_URL: "postgres://pool.example/salon",
    };

    expect(configureDatabaseUrl(environment)).toEqual({
      configured: true,
      source: "POSTGRES_PRISMA_URL",
      isPostgreSQL: true,
    });
    expect(environment.DATABASE_URL).toBe("postgres://pool.example/salon");
  });

  it("rejects a local SQLite URL as hosted PostgreSQL", () => {
    const environment = { DATABASE_URL: "file:./dev.db" };

    expect(configureDatabaseUrl(environment).isPostgreSQL).toBe(false);
  });
});
