import { describe, expect, it } from "vitest";
import { getDatabaseConfiguration } from "../src/lib/database-url";

describe("database URL configuration", () => {
  it("accepts a Supabase PostgreSQL URL", () => {
    const environment = {
      DATABASE_URL: "postgresql://user:password@pooler.supabase.com:6543/postgres",
    };

    expect(getDatabaseConfiguration(environment)).toEqual({
      configured: true,
      isPostgreSQL: true,
    });
  });

  it("reports a missing URL", () => {
    expect(getDatabaseConfiguration({})).toEqual({
      configured: false,
      isPostgreSQL: false,
    });
  });

  it("rejects a SQLite URL", () => {
    const environment = { DATABASE_URL: "file:./dev.db" };

    expect(getDatabaseConfiguration(environment).isPostgreSQL).toBe(false);
  });
});
