"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Scissors,
  User,
  Phone,
  MessageSquare,
  MapPin,
  Share2,
  Printer,
  PlusCircle,
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  createWhatsAppUrl,
  generateBookingVoucherMessage,
} from "@/lib/whatsapp";
import {
  createGoogleCalendarUrl,
  createIcsDataUrl,
} from "@/lib/calendar-export";

export interface ConfirmedAppointment {
  id: string;
  appointmentNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: string;
  customerNotes: string | null;
  customer: {
    name: string;
    phone: string;
    email: string | null;
  };
  service: {
    name: string;
    category: string;
    price: number;
    duration: number;
  };
  staff: {
    name: string;
    role: string;
    phone: string | null;
  } | null;
}

export const BookingConfirmationView = ({
  appointment,
}: {
  appointment: ConfirmedAppointment;
}) => {
  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#F5E296", "#FFFFFF", "#25D366"],
      });
    } catch {
      // ignore
    }
  }, []);

  // WhatsApp prefilled voucher link
  const whatsappMessage = generateBookingVoucherMessage({
    appointmentNumber: appointment.appointmentNumber,
    customerName: appointment.customer.name,
    customerPhone: appointment.customer.phone,
    serviceName: appointment.service.name,
    barberName: appointment.staff ? appointment.staff.name : "Master Barber",
    date: appointment.date,
    time: appointment.startTime,
    duration: appointment.duration,
    price: appointment.totalPrice,
    notes: appointment.customerNotes,
  });

  const whatsappUrl = createWhatsAppUrl("918888857057", whatsappMessage);

  // Calendar sync details
  const calendarEvent = {
    title: `💈 ${appointment.service.name} @ Champion Hair Salon`,
    description: `Appointment #${appointment.appointmentNumber}\nService: ${appointment.service.name}\nBarber: ${appointment.staff ? appointment.staff.name : "Champion Master Barber"}\nSalon Phone: +91 8888857057`,
    location: "Champion Hair Salon, Main Market, Maharashtra, India",
    date: appointment.date,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
  };

  const googleCalUrl = createGoogleCalendarUrl(calendarEvent);
  const icsUrl = createIcsDataUrl(calendarEvent);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <Badge variant="gold" size="sm">
          ESTABLISHED 1998 • BOOKING CONFIRMED
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Appointment Confirmed!
        </h1>
        <p className="text-sm text-[#B5B5B5]">
          Your chair is reserved at Champion Hair Salon. A confirmation summary is displayed below.
        </p>
      </div>

      {/* Luxury Printable Voucher Card */}
      <Card
        id="booking-voucher"
        goldBorder
        className="bg-[#141414] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-black"
      >
        {/* Subtle watermarked background logo */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-5 text-[#D4AF37] pointer-events-none">
          <Scissors className="w-full h-full" />
        </div>

        {/* Voucher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] print:border-black">
              <Scissors className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white print:text-black">
                CHAMPION HAIR SALON
              </h2>
              <p className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold print:text-gray-700">
                Since 1998 • Sachin Mahaley
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs uppercase tracking-wider text-[#8E8E8E] block">
              Booking Reference
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-[#D4AF37] print:text-black">
              {appointment.appointmentNumber}
            </span>
          </div>
        </div>

        {/* Booking Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-sm">
          <div>
            <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block">Customer</span>
            <span className="font-bold text-white print:text-black">{appointment.customer.name}</span>
            <p className="text-xs text-[#8E8E8E]">{appointment.customer.phone}</p>
          </div>

          <div>
            <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block">Service</span>
            <span className="font-bold text-white print:text-black">{appointment.service.name}</span>
            <p className="text-xs text-[#8E8E8E]">{appointment.duration} Minutes</p>
          </div>

          <div>
            <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block">Barber / Stylist</span>
            <span className="font-bold text-white print:text-black">
              {appointment.staff ? appointment.staff.name : "Master Barber"}
            </span>
            <p className="text-xs text-[#8E8E8E]">Champion Team</p>
          </div>

          <div>
            <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block">Date & Time</span>
            <span className="font-bold text-[#D4AF37] print:text-black block">
              {appointment.date}
            </span>
            <p className="text-xs text-white print:text-black font-semibold">
              {appointment.startTime} – {appointment.endTime}
            </p>
          </div>
        </div>

        {/* Total Price & Status Strip */}
        <div className="p-4 rounded-xl bg-[#1A1A1A] border border-white/5 flex items-center justify-between print:border-black print:bg-gray-100">
          <div>
            <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block">
              Payment (Pay at Salon)
            </span>
            <span className="text-2xl font-bold font-display text-[#D4AF37] print:text-black">
              ₹{appointment.totalPrice}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block mb-1">
              Status
            </span>
            <Badge variant="success" size="md">
              CONFIRMED
            </Badge>
          </div>
        </div>

        {appointment.customerNotes && (
          <div className="text-xs text-[#8E8E8E] border-t border-white/5 pt-3">
            <strong className="text-white">Customer Notes:</strong> {appointment.customerNotes}
          </div>
        )}

        {/* Location & Instructions */}
        <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#8E8E8E] gap-2">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            Champion Hair Salon, Main Market, Maharashtra, India
          </span>
          <span>Helpline: +91 8888857057</span>
        </div>
      </Card>

      {/* Action Buttons Grid */}
      <div className="space-y-4 print:hidden">
        {/* Primary WhatsApp Share */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Button
            size="lg"
            className="w-full justify-center bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold shadow-[0_4px_20px_rgba(37,211,102,0.3)] border-transparent"
            leftIcon={<MessageSquare className="w-5 h-5 fill-current" />}
          >
            Send Booking Details on WhatsApp
          </Button>
        </a>

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Add to Google Calendar */}
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center text-xs"
              leftIcon={<Calendar className="w-4 h-4 text-[#D4AF37]" />}
            >
              Google Calendar
            </Button>
          </a>

          {/* Download .ICS */}
          <a href={icsUrl} download={`champion-appointment-${appointment.appointmentNumber}.ics`}>
            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center text-xs"
              leftIcon={<Download className="w-4 h-4 text-[#D4AF37]" />}
            >
              Download iCal (.ics)
            </Button>
          </a>

          {/* Print Voucher */}
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrint}
            className="w-full justify-center text-xs"
            leftIcon={<Printer className="w-4 h-4 text-[#D4AF37]" />}
          >
            Print Voucher
          </Button>
        </div>

        {/* Book Again & Call */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <Link href="/book" className="w-full sm:w-auto">
            <Button variant="ghost" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Book Another Appointment
            </Button>
          </Link>

          <a href="tel:+918888857057" className="w-full sm:w-auto">
            <Button variant="ghost" size="sm" leftIcon={<Phone className="w-4 h-4 text-[#D4AF37]" />}>
              Call Salon Desk: +91 8888857057
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
