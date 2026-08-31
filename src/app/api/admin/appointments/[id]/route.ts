import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes, staffId } = body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(staffId !== undefined && { staffId: staffId || null }),
      },
      include: {
        customer: true,
        service: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, message: "Appointment cancelled" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}
