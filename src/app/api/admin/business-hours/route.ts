import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const hours = await prisma.businessHours.findMany({
      orderBy: { dayOfWeek: "asc" },
    });
    return NextResponse.json({ hours });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch business hours" },
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
    const { hours } = body; // Array of 7 day configurations

    if (!Array.isArray(hours)) {
      return NextResponse.json({ error: "Invalid hours data" }, { status: 400 });
    }

    for (const h of hours) {
      await prisma.businessHours.upsert({
        where: { dayOfWeek: h.dayOfWeek },
        update: {
          isOpen: h.isOpen,
          openTime: h.openTime,
          closeTime: h.closeTime,
          hasBreak: h.hasBreak || false,
          breakStart: h.breakStart || null,
          breakEnd: h.breakEnd || null,
        },
        create: {
          dayOfWeek: h.dayOfWeek,
          dayName: h.dayName,
          isOpen: h.isOpen,
          openTime: h.openTime,
          closeTime: h.closeTime,
          hasBreak: h.hasBreak || false,
          breakStart: h.breakStart || null,
          breakEnd: h.breakEnd || null,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Business hours updated" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update hours" },
      { status: 500 }
    );
  }
}
