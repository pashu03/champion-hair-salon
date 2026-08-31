import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations";

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
    const validated = serviceSchema.parse(body);

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: validated.name,
        category: validated.category,
        price: validated.price,
        duration: validated.duration,
        description: validated.description || null,
        isPopular: validated.isPopular,
        isActive: validated.isActive,
        displayOrder: validated.displayOrder,
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update service" },
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
    // Check if appointments exist before deleting
    const apptCount = await prisma.appointment.count({ where: { serviceId: id } });
    if (apptCount > 0) {
      // Soft-delete by setting isActive to false
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Service deactivated because prior appointments exist.",
      });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Service deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete service" },
      { status: 500 }
    );
  }
}
