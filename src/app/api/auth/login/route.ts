import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { getDatabaseConfiguration } from "@/lib/database-url";
import { adminLoginSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = adminLoginSchema.parse(body);

    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401, headers: responseHeaders }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401, headers: responseHeaders }
      );
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: sessionUser,
      },
      { headers: responseHeaders }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Please enter a valid admin email and password." },
        { status: 400, headers: responseHeaders }
      );
    }

    const database = getDatabaseConfiguration();
    const isDatabaseConfigurationError =
      !database.configured || !database.isPostgreSQL;

    console.error(
      `Admin login error [${
        isDatabaseConfigurationError
          ? "DATABASE_NOT_CONFIGURED"
          : "AUTHENTICATION_SERVICE_ERROR"
      }]:`,
      error
    );

    return NextResponse.json(
      {
        error: isDatabaseConfigurationError
          ? "Admin login is temporarily unavailable. The production database must be connected."
          : "Admin login is temporarily unavailable. Please try again.",
        code: isDatabaseConfigurationError
          ? "DATABASE_NOT_CONFIGURED"
          : "AUTHENTICATION_SERVICE_ERROR",
      },
      { status: 503, headers: responseHeaders }
    );
  }
}
