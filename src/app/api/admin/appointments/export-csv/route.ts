import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        customer: true,
        service: true,
        staff: true,
      },
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
    });

    const headers = [
      "Appointment Number",
      "Customer Name",
      "Customer Phone",
      "Service",
      "Price (INR)",
      "Duration (Mins)",
      "Barber",
      "Date",
      "Start Time",
      "End Time",
      "Status",
      "Source",
      "Customer Notes",
      "Created At",
    ];

    const rows = appointments.map((a) => [
      `"${a.appointmentNumber}"`,
      `"${a.customer.name.replace(/"/g, '""')}"`,
      `"${a.customer.phone}"`,
      `"${a.service.name.replace(/"/g, '""')}"`,
      a.totalPrice,
      a.duration,
      `"${(a.staff?.name || "Unassigned").replace(/"/g, '""')}"`,
      `"${a.date}"`,
      `"${a.startTime}"`,
      `"${a.endTime}"`,
      `"${a.status}"`,
      `"${a.source}"`,
      `"${(a.customerNotes || "").replace(/"/g, '""')}"`,
      `"${a.createdAt.toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="champion-appointments-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to export CSV" },
      { status: 500 }
    );
  }
}
