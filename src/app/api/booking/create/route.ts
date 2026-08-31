import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingFormSchema } from "@/lib/validations";
import { generateAppointmentNumber } from "@/lib/booking-id";
import { timeToMinutes, minutesToTime, isOverlapping } from "@/lib/availability";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = bookingFormSchema.parse(body);

    const { serviceId, staffId, date, time, name, phone, email, notes } = validated;

    // Run within a Prisma transaction to prevent concurrency / double-booking collisions
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify Service exists and is active
      const service = await tx.service.findUnique({
        where: { id: serviceId },
      });

      if (!service || !service.isActive) {
        throw new Error("The selected service is not available for booking.");
      }

      // Calculate start and end times in minutes
      const startMins = timeToMinutes(time);
      const endMins = startMins + service.duration;
      const endTimeStr = minutesToTime(endMins);

      // 2. Determine and verify staff assignment
      let assignedStaffId = staffId || null;

      if (assignedStaffId) {
        const staffMember = await tx.staff.findUnique({
          where: { id: assignedStaffId },
          include: {
            availabilities: true,
          },
        });

        if (!staffMember || !staffMember.isActive) {
          throw new Error("The selected barber is currently not active.");
        }
      } else {
        // If "Any Barber" was chosen, find a free active barber for this slot
        const activeBarbers = await tx.staff.findMany({
          where: { isActive: true },
        });

        const dayOfWeek = new Date(date).getDay();

        // Check existing appointments on this date
        const existingAppts = await tx.appointment.findMany({
          where: {
            date,
            status: { notIn: ["CANCELLED"] },
          },
        });

        // Find the first barber who is free during this slot
        for (const barber of activeBarbers) {
          const hasConflict = existingAppts.some((appt) => {
            if (appt.staffId && appt.staffId !== barber.id) return false;
            const aStart = timeToMinutes(appt.startTime);
            const aEnd = timeToMinutes(appt.endTime);
            return isOverlapping(startMins, endMins, aStart, aEnd);
          });

          if (!hasConflict) {
            assignedStaffId = barber.id;
            break;
          }
        }
      }

      // 3. Double-Booking Conflict Check
      if (assignedStaffId) {
        const conflictingAppointments = await tx.appointment.findMany({
          where: {
            date,
            staffId: assignedStaffId,
            status: { notIn: ["CANCELLED"] },
          },
        });

        const hasDoubleBooking = conflictingAppointments.some((appt) => {
          const aStart = timeToMinutes(appt.startTime);
          const aEnd = timeToMinutes(appt.endTime);
          return isOverlapping(startMins, endMins, aStart, aEnd);
        });

        if (hasDoubleBooking) {
          throw new Error(
            "That time slot was just booked by another customer. Please choose another time."
          );
        }
      }

      // 4. Upsert or find Customer record based on normalized phone
      const normalizedPhone = phone.replace(/[^0-9]/g, "");
      let customer = await tx.customer.findUnique({
        where: { phone: normalizedPhone },
      });

      if (customer) {
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            name: name, // update name to latest provided
            email: email || customer.email,
            totalVisits: { increment: 1 },
            lastVisit: new Date(),
          },
        });
      } else {
        customer = await tx.customer.create({
          data: {
            name: name,
            phone: normalizedPhone,
            email: email || null,
            totalVisits: 1,
            lastVisit: new Date(),
          },
        });
      }

      // 5. Generate human-readable appointment number e.g. CH-2026-000101
      const appointmentNumber = generateAppointmentNumber();

      // 6. Create the Appointment
      const appointment = await tx.appointment.create({
        data: {
          appointmentNumber,
          customerId: customer.id,
          serviceId: service.id,
          staffId: assignedStaffId,
          date,
          startTime: time,
          endTime: endTimeStr,
          duration: service.duration,
          totalPrice: service.price,
          status: "CONFIRMED", // Instant confirmed booking for frictionless salon flow
          customerNotes: notes || null,
          source: "ONLINE",
        },
        include: {
          service: true,
          staff: true,
          customer: true,
        },
      });

      return appointment;
    });

    return NextResponse.json({
      success: true,
      appointmentId: result.id,
      appointmentNumber: result.appointmentNumber,
      appointment: result,
    });
  } catch (error: any) {
    console.error("Booking Creation Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to complete appointment booking." },
      { status: 400 }
    );
  }
}
