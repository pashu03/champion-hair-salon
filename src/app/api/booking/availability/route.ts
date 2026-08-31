import { NextRequest, NextResponse } from "next/server";
import { calculateAvailableSlots } from "@/lib/availability";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "30", 10);
    const staffId = searchParams.get("staffId") || undefined;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const availability = await calculateAvailableSlots({
      date,
      serviceDuration: isNaN(duration) ? 30 : duration,
      staffId: staffId || null,
    });

    return NextResponse.json(availability);
  } catch (error: any) {
    console.error("Availability API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to calculate slot availability" },
      { status: 500 }
    );
  }
}
