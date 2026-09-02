import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getDatabaseConfiguration } from "@/lib/database-url";
import { contactFormSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = contactFormSchema.parse(body);

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        email: validated.email || null,
        message: validated.message,
        status: "UNREAD",
      },
    });

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Please check your details." },
        { status: 400 }
      );
    }

    const database = getDatabaseConfiguration();
    const code = !database.configured
      ? "DATABASE_NOT_CONFIGURED"
      : !database.isPostgreSQL
        ? "DATABASE_URL_INVALID"
        : "CONTACT_SERVICE_ERROR";

    console.error(`Contact API Error [${code}]:`, error);
    return NextResponse.json(
      {
        error: "We could not send your message right now. Please try again.",
        code,
      },
      { status: 503 }
    );
  }
}
