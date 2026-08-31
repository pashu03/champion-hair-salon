import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const appointment = await prisma.appointment.findFirst({
      where: {
        OR: [{ id }, { appointmentNumber: id }],
      },
      include: {
        service: true,
        staff: true,
        customer: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}
