import React, { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Calendar, Loader2 } from "lucide-react";
import {
  fallbackServices,
  fallbackStaff,
  withPublicFallback,
} from "@/lib/public-fallback-data";

export const metadata: Metadata = {
  title: "Book Appointment Online",
  description:
    "Reserve your haircut, beard styling, hair colour, or facial with Sachin Mahaley & Champion Hair Salon. Instant booking and live chair availability.",
};

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const services = await withPublicFallback(
    "booking services",
    () =>
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { price: "asc" }],
        select: {
          id: true,
          name: true,
          category: true,
          price: true,
          duration: true,
          description: true,
          isPopular: true,
        },
      }),
    fallbackServices
  );

  const staffList = await withPublicFallback(
    "booking staff",
    () =>
      prisma.staff.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          name: true,
          role: true,
          photo: true,
          specialties: true,
        },
      }),
    fallbackStaff
  );

  return (
    <div className="pt-28 pb-24 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <Calendar className="w-4 h-4" />
            <span>Instant Online Booking</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            Reserve Your Grooming Session
          </h1>
          <p className="text-base sm:text-lg text-[#B5B5B5]">
            Select your service, barber, and preferred time slot. No advance payment required.
          </p>
        </div>

        {/* Wizard Container */}
        <Suspense
          fallback={
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
              <p className="text-sm text-[#8E8E8E]">Loading salon booking calendar...</p>
            </div>
          }
        >
          <BookingWizard services={services} staffList={staffList} />
        </Suspense>
      </div>
    </div>
  );
}
