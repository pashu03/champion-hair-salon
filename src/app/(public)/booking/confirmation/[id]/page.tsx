import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BookingConfirmationView } from "@/components/booking/BookingConfirmationView";

export const metadata: Metadata = {
  title: "Booking Voucher Confirmation",
  description: "Your confirmed appointment voucher for Champion Hair Salon.",
};

export const dynamic = "force-dynamic";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const appointment = await prisma.appointment.findFirst({
    where: {
      OR: [{ id }, { appointmentNumber: id }],
    },
    include: {
      customer: true,
      service: true,
      staff: true,
    },
  });

  if (!appointment) {
    notFound();
  }

  return (
    <div className="pt-28 pb-24 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookingConfirmationView appointment={appointment} />
      </div>
    </div>
  );
}
