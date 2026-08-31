import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enquiries = await prisma.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ enquiries });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}
