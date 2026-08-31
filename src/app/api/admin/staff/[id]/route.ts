import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { staffSchema } from "@/lib/validations";

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
    const validated = staffSchema.parse(body);

    const staffMember = await prisma.staff.update({
      where: { id },
      data: {
        name: validated.name,
        role: validated.role,
        phone: validated.phone || null,
        photo: validated.photo || null,
        bio: validated.bio || null,
        specialties: validated.specialties,
        isActive: validated.isActive,
        displayOrder: validated.displayOrder,
      },
    });

    return NextResponse.json({ success: true, staff: staffMember });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update barber" },
      { status: 400 }
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
    await prisma.staff.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Staff member deactivated." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete staff" },
      { status: 500 }
    );
  }
}
