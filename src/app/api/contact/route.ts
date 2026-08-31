import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to submit contact enquiry" },
      { status: 400 }
    );
  }
}
