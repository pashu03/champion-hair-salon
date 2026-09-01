import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.businessSettings.findFirst();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = settingsSchema.parse(body);

    const existing = await prisma.businessSettings.findFirst();

    const updated = await prisma.businessSettings.upsert({
      where: { id: existing?.id || "default-settings" },
      update: validated,
      create: {
        id: "default-settings",
        ...validated,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to save settings" },
      { status: 400 }
    );
  }
}
