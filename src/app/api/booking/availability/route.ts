import { NextRequest, NextResponse } from "next/server";
import { calculateAvailableSlots, isValidDateString } from "@/lib/availability";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "30", 10);
    const staffId = searchParams.get("staffId") || undefined;

    if (!date || !isValidDateString(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(duration) || duration < 5 || duration > 480) {
      return NextResponse.json(
        { error: "Invalid service duration." },
        { status: 400 }
      );
    }

    const availability = await calculateAvailableSlots({
      date,
      serviceDuration: duration,
      staffId: staffId || null,
    });

    return NextResponse.json(availability);
  } catch (error: unknown) {
    console.error("Availability API Error:", error);
    return NextResponse.json(
      { error: "Live availability is temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }
}
