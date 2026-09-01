import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { bookingFormSchema } from "@/lib/validations";
import { generateAppointmentNumber } from "@/lib/booking-id";
import {
  calculateAvailableSlots,
  isOverlapping,
  minutesToTime,
  timeToMinutes,
} from "@/lib/availability";

class BookingRequestError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "BookingRequestError";
  }
}

const isRetryableTransactionError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = bookingFormSchema.parse(body);
    const { serviceId, staffId, date, time, name, phone, email, notes } = validated;

    // Availability is authoritative on the server. A client cannot submit a
    // closed, expired, off-shift, blocked, or fabricated time slot.
    const requestedService = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!requestedService || !requestedService.isActive) {
      throw new BookingRequestError(
        "The selected service is not available for booking.",
        404
      );
    }

    const availability = await calculateAvailableSlots({
      date,
      serviceDuration: requestedService.duration,
      staffId: staffId || null,
    });
    const requestedSlot = availability.slots.find((slot) => slot.time === time);

    if (!availability.isOpen || !requestedSlot) {
      throw new BookingRequestError(
        availability.reason ||
          "That time slot is no longer available. Please choose another time.",
        409
      );
    }

    const candidateStaffIds = requestedSlot.availableBarbers.map((barber) => barber.id);
    if (staffId && !candidateStaffIds.includes(staffId)) {
      throw new BookingRequestError(
        "The selected barber is not available at that time.",
        409
      );
    }

    const createAppointment = () =>
      prisma.$transaction(
        async (tx) => {
          const service = await tx.service.findUnique({
            where: { id: serviceId },
          });

          if (!service || !service.isActive) {
            throw new BookingRequestError(
              "The selected service is not available for booking.",
              404
            );
          }

          const startMins = timeToMinutes(time);
          const endMins = startMins + service.duration;
          const endTime = minutesToTime(endMins);
          const eligibleStaff = await tx.staff.findMany({
            where: {
              id: { in: staffId ? [staffId] : candidateStaffIds },
              isActive: true,
            },
            orderBy: { displayOrder: "asc" },
          });
          const existingAppointments = await tx.appointment.findMany({
            where: {
              date,
              status: { notIn: ["CANCELLED"] },
            },
          });

          const assignedStaff = eligibleStaff.find((barber) =>
            existingAppointments.every((appointment) => {
              if (appointment.staffId && appointment.staffId !== barber.id) return true;

              return !isOverlapping(
                startMins,
                endMins,
                timeToMinutes(appointment.startTime),
                timeToMinutes(appointment.endTime)
              );
            })
          );

          if (!assignedStaff) {
            throw new BookingRequestError(
              "That time slot was just booked by another customer. Please choose another time.",
              409
            );
          }

          const normalizedPhone = phone.replace(/[^0-9]/g, "");
          const existingCustomer = await tx.customer.findUnique({
            where: { phone: normalizedPhone },
          });
          const customer = existingCustomer
            ? await tx.customer.update({
                where: { id: existingCustomer.id },
                data: {
                  name,
                  email: email || existingCustomer.email,
                  totalVisits: { increment: 1 },
                  lastVisit: new Date(),
                },
              })
            : await tx.customer.create({
                data: {
                  name,
                  phone: normalizedPhone,
                  email: email || null,
                  totalVisits: 1,
                  lastVisit: new Date(),
                },
              });

          return tx.appointment.create({
            data: {
              appointmentNumber: generateAppointmentNumber(),
              customerId: customer.id,
              serviceId: service.id,
              staffId: assignedStaff.id,
              date,
              startTime: time,
              endTime,
              duration: service.duration,
              totalPrice: service.price,
              status: "CONFIRMED",
              customerNotes: notes || null,
              source: "ONLINE",
            },
            include: {
              service: true,
              staff: true,
              customer: true,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );

    let result;
    for (let attempt = 0; ; attempt += 1) {
      try {
        result = await createAppointment();
        break;
      } catch (error: unknown) {
        if (attempt < 2 && isRetryableTransactionError(error)) continue;
        throw error;
      }
    }

    return NextResponse.json(
      {
        success: true,
        appointmentId: result.id,
        appointmentNumber: result.appointmentNumber,
        appointment: result,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Please check your booking details." },
        { status: 400 }
      );
    }

    if (error instanceof BookingRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Booking Creation Error:", error);
    return NextResponse.json(
      { error: "We could not complete your booking. Please try again." },
      { status: 500 }
    );
  }
}
