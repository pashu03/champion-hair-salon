import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { staffSchema } from "@/lib/validations";

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        availabilities: true,
      },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ staff });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = staffSchema.parse(body);

    const staffMember = await prisma.staff.create({
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

    // Create standard 7-day availabilities
    for (let d = 0; d <= 6; d++) {
      await prisma.staffAvailability.create({
        data: {
          staffId: staffMember.id,
          dayOfWeek: d,
          isWorking: true,
          startTime: "09:00",
          endTime: "21:00",
        },
      });
    }

    return NextResponse.json({ success: true, staff: staffMember }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create barber profile" },
      { status: 400 }
    );
  }
}
