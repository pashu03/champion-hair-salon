import { prisma } from "./prisma";

export interface AvailableSlot {
  time: string; // HH:mm format (e.g. "10:00")
  endTime: string; // HH:mm format (e.g. "10:30")
  availableBarbers: { id: string; name: string }[];
}

export interface AvailabilityResult {
  isOpen: boolean;
  reason?: string;
  slots: AvailableSlot[];
}

/**
 * Converts "HH:mm" string to minutes from midnight
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Converts minutes from midnight to "HH:mm" string
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Checks if two time intervals [start1, end1] and [start2, end2] overlap
 */
export function isOverlapping(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  return Math.max(start1, start2) < Math.min(end1, end2);
}

/**
 * Calculates available appointment slots for a given date, service duration, and optional barber
 */
export async function calculateAvailableSlots(params: {
  date: string; // YYYY-MM-DD
  serviceDuration: number; // in minutes
  staffId?: string | null;
}): Promise<AvailabilityResult> {
  const { date, serviceDuration, staffId } = params;

  // 1. Determine day of week (0=Sunday ... 6=Saturday)
  const [year, month, day] = date.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day);
  const dayOfWeek = targetDate.getDay();

  // 2. Fetch business settings & business hours
  const settings = await prisma.businessSettings.findFirst();
  const slotInterval = settings?.slotInterval || 30;
  const advanceNoticeHours = settings?.advanceNoticeHours || 1;

  const businessHours = await prisma.businessHours.findUnique({
    where: { dayOfWeek },
  });

  if (!businessHours || !businessHours.isOpen) {
    return {
      isOpen: false,
      reason: `Champion Hair Salon is closed on ${businessHours?.dayName || "this day"}.`,
      slots: [],
    };
  }

  // 3. Check for all-day salon blocked periods (holidays / emergency closure)
  const blockedPeriods = await prisma.blockedPeriod.findMany({
    where: {
      startDate: { lte: date },
      endDate: { gte: date },
    },
  });

  const isAllDaySalonBlocked = blockedPeriods.some(
    (bp) => !bp.staffId && bp.isAllDay
  );

  if (isAllDaySalonBlocked) {
    const reason = blockedPeriods.find((bp) => !bp.staffId && bp.isAllDay)?.reason || "Special salon holiday";
    return {
      isOpen: false,
      reason: `Salon is closed on this date (${reason}).`,
      slots: [],
    };
  }

  // 4. Fetch active staff members and their shifts for this day
  const staffQuery = staffId
    ? { id: staffId, isActive: true }
    : { isActive: true };

  const allActiveStaff = await prisma.staff.findMany({
    where: staffQuery,
    include: {
      availabilities: {
        where: { dayOfWeek, isWorking: true },
      },
      blockedPeriods: {
        where: {
          startDate: { lte: date },
          endDate: { gte: date },
        },
      },
    },
  });

  // Filter staff who are actually scheduled to work on this day and not all-day blocked
  const eligibleStaff = allActiveStaff.filter((staff) => {
    const hasShift = staff.availabilities.length > 0;
    const isStaffBlockedAllDay = staff.blockedPeriods.some((bp) => bp.isAllDay);
    return hasShift && !isStaffBlockedAllDay;
  });

  if (eligibleStaff.length === 0) {
    return {
      isOpen: false,
      reason: staffId
        ? "The selected barber is not available on this date."
        : "No barbers are available on this date.",
      slots: [],
    };
  }

  // 5. Fetch all existing active appointments on this date
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      date,
      status: { notIn: ["CANCELLED"] },
    },
  });

  // 6. Generate time windows
  const openMins = timeToMinutes(businessHours.openTime);
  const closeMins = timeToMinutes(businessHours.closeTime);

  // Shop break window (if enabled)
  let breakStartMins = -1;
  let breakEndMins = -1;
  if (businessHours.hasBreak && businessHours.breakStart && businessHours.breakEnd) {
    breakStartMins = timeToMinutes(businessHours.breakStart);
    breakEndMins = timeToMinutes(businessHours.breakEnd);
  }

  // Calculate current cutoff time for same-day bookings
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  const isToday = date === todayStr;
  const currentMinsFromMidnight = now.getHours() * 60 + now.getMinutes();
  const minAllowedSlotMins = isToday
    ? currentMinsFromMidnight + advanceNoticeHours * 60
    : 0;

  const availableSlots: AvailableSlot[] = [];

  // Loop through slots
  for (
    let slotStart = openMins;
    slotStart + serviceDuration <= closeMins;
    slotStart += slotInterval
  ) {
    const slotEnd = slotStart + serviceDuration;

    // Check same-day advance notice restriction
    if (isToday && slotStart < minAllowedSlotMins) {
      continue;
    }

    // Check if slot overlaps with salon break time
    if (
      breakStartMins !== -1 &&
      isOverlapping(slotStart, slotEnd, breakStartMins, breakEndMins)
    ) {
      continue;
    }

    // Check partial-day global blocked periods
    const isOverlappingGlobalBlocked = blockedPeriods.some((bp) => {
      if (bp.staffId || bp.isAllDay || !bp.startTime || !bp.endTime) return false;
      const bpStart = timeToMinutes(bp.startTime);
      const bpEnd = timeToMinutes(bp.endTime);
      return isOverlapping(slotStart, slotEnd, bpStart, bpEnd);
    });

    if (isOverlappingGlobalBlocked) {
      continue;
    }

    // Find which eligible barbers are free during this slot [slotStart, slotEnd]
    const freeBarbersForSlot: { id: string; name: string }[] = [];

    for (const barber of eligibleStaff) {
      const shift = barber.availabilities[0];
      const shiftStart = timeToMinutes(shift.startTime);
      const shiftEnd = timeToMinutes(shift.endTime);

      // Barber must be on duty for the entire slot
      if (slotStart < shiftStart || slotEnd > shiftEnd) {
        continue;
      }

      // Check barber-specific partial blocked time
      const isBarberBlocked = barber.blockedPeriods.some((bp) => {
        if (!bp.startTime || !bp.endTime) return true;
        const bpStart = timeToMinutes(bp.startTime);
        const bpEnd = timeToMinutes(bp.endTime);
        return isOverlapping(slotStart, slotEnd, bpStart, bpEnd);
      });

      if (isBarberBlocked) {
        continue;
      }

      // Check existing appointments for this specific barber
      const hasConflict = existingAppointments.some((appt) => {
        if (appt.staffId && appt.staffId !== barber.id) {
          return false; // booked with a different barber
        }
        const apptStart = timeToMinutes(appt.startTime);
        const apptEnd = timeToMinutes(appt.endTime);
        return isOverlapping(slotStart, slotEnd, apptStart, apptEnd);
      });

      if (!hasConflict) {
        freeBarbersForSlot.push({
          id: barber.id,
          name: barber.name,
        });
      }
    }

    // If at least one barber is free, record this slot
    if (freeBarbersForSlot.length > 0) {
      availableSlots.push({
        time: minutesToTime(slotStart),
        endTime: minutesToTime(slotEnd),
        availableBarbers: freeBarbersForSlot,
      });
    }
  }

  return {
    isOpen: true,
    slots: availableSlots,
  };
}
