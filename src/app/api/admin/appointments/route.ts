import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { generateAppointmentNumber } from "@/lib/booking-id";
import { timeToMinutes, minutesToTime } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const date = searchParams.get("date") || "";
    const staffId = searchParams.get("staffId") || "";

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (date) {
      where.date = date;
    }

    if (staffId && staffId !== "ALL") {
      where.staffId = staffId;
    }

    if (search) {
      where.OR = [
        { appointmentNumber: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } },
        { service: { name: { contains: search } } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: true,
        service: true,
        staff: true,
      },
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
    });

    return NextResponse.json({ appointments });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST: Create manual / Walk-in appointment from admin
export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { customerName, phone, serviceId, staffId, date, time, notes, status } = body;

    if (!customerName || !phone || !serviceId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required appointment fields" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: "Invalid service" }, { status: 400 });
    }

    const startMins = timeToMinutes(time);
    const endMins = startMins + service.duration;
    const endTime = minutesToTime(endMins);

    // Upsert customer
    const normalizedPhone = phone.replace(/[^0-9]/g, "");
    let customer = await prisma.customer.findUnique({
      where: { phone: normalizedPhone },
    });

    if (customer) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customerName,
          totalVisits: { increment: 1 },
          lastVisit: new Date(),
        },
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: normalizedPhone,
          totalVisits: 1,
          lastVisit: new Date(),
        },
      });
    }

    const appointmentNumber = generateAppointmentNumber();

    const appointment = await prisma.appointment.create({
      data: {
        appointmentNumber,
        customerId: customer.id,
        serviceId: service.id,
        staffId: staffId || null,
        date,
        startTime: time,
        endTime,
        duration: service.duration,
        totalPrice: service.price,
        status: status || "CONFIRMED",
        customerNotes: notes || null,
        source: "WALK_IN",
      },
      include: {
        customer: true,
        service: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create manual appointment" },
      { status: 500 }
    );
  }
}
