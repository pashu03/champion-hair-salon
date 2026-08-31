import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    // 1. Counters
    const todayAppointmentsCount = await prisma.appointment.count({
      where: { date: todayStr },
    });

    const upcomingAppointmentsCount = await prisma.appointment.count({
      where: {
        date: { gte: todayStr },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    const pendingCount = await prisma.appointment.count({
      where: { status: "PENDING" },
    });

    const completedCount = await prisma.appointment.count({
      where: { status: "COMPLETED" },
    });

    const cancelledCount = await prisma.appointment.count({
      where: { status: "CANCELLED" },
    });

    const totalCustomersCount = await prisma.customer.count();

    // 2. Today's appointments schedule
    const todaySchedule = await prisma.appointment.findMany({
      where: { date: todayStr },
      include: {
        customer: true,
        service: true,
        staff: true,
      },
      orderBy: { startTime: "asc" },
    });

    // 3. Recent Bookings
    const recentBookings = await prisma.appointment.findMany({
      take: 8,
      include: {
        customer: true,
        service: true,
        staff: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 4. Calculate total revenue estimated from completed/confirmed appointments
    const revenueSum = await prisma.appointment.aggregate({
      _sum: { totalPrice: true },
      where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
    });

    return NextResponse.json({
      stats: {
        todayCount: todayAppointmentsCount,
        upcomingCount: upcomingAppointmentsCount,
        pendingCount,
        completedCount,
        cancelledCount,
        totalCustomers: totalCustomersCount,
        estimatedRevenue: revenueSum._sum.totalPrice || 0,
      },
      todaySchedule,
      recentBookings,
    });
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
