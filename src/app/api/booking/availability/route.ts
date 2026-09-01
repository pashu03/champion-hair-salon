import { NextRequest, NextResponse } from "next/server";
import { calculateAvailableSlots, isValidDateString } from "@/lib/availability";
import { configureDatabaseUrl } from "@/lib/database-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const responseHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "30", 10);
    const staffId = searchParams.get("staffId") || undefined;

    if (!date || !isValidDateString(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD" },
        { status: 400, headers: responseHeaders }
      );
    }

    if (!Number.isInteger(duration) || duration < 5 || duration > 480) {
      return NextResponse.json(
        { error: "Invalid service duration." },
        { status: 400, headers: responseHeaders }
      );
    }

    const availability = await calculateAvailableSlots({
      date,
      serviceDuration: duration,
      staffId: staffId || null,
    });

    return NextResponse.json(availability, { headers: responseHeaders });
  } catch (error: unknown) {
    const database = configureDatabaseUrl();
    const code = !database.configured
      ? "DATABASE_NOT_CONFIGURED"
      : process.env.VERCEL === "1" && !database.isPostgreSQL
        ? "DATABASE_URL_INVALID"
        : "AVAILABILITY_SERVICE_ERROR";

    console.error(`Availability API Error [${code}]:`, error);
    return NextResponse.json(
      {
        error: "Live availability is temporarily unavailable. Please try again.",
        code,
      },
      { status: 503, headers: responseHeaders }
    );
  }
}
