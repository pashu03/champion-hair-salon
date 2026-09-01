/**
 * WhatsApp integration helpers for Champion Hair Salon
 */

import { formatTime12Hour } from "./time-format";

const DEFAULT_SALON_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918888857057";

export interface BookingDetailsForWhatsApp {
  appointmentNumber: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  barberName?: string | null;
  date: string;
  time: string;
  duration: number;
  price: number;
  notes?: string | null;
}

/**
 * Builds direct WhatsApp URL with pre-filled encoded text
 */
export function createWhatsAppUrl(phoneNumber: string = DEFAULT_SALON_WHATSAPP, message: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Generates WhatsApp voucher confirmation message that the customer can send to the salon
 */
export function generateBookingVoucherMessage(booking: BookingDetailsForWhatsApp): string {
  const lines = [
    `💈 *CHAMPION HAIR SALON - BOOKING CONFIRMATION*`,
    `----------------------------------------`,
    `🎫 *Booking ID:* ${booking.appointmentNumber}`,
    `👤 *Customer Name:* ${booking.customerName}`,
    `📞 *Phone:* ${booking.customerPhone}`,
    `✂️ *Service:* ${booking.serviceName}`,
    `🧔 *Barber:* ${booking.barberName || "Any Master Barber"}`,
    `📅 *Date:* ${booking.date}`,
    `⏰ *Time Slot:* ${formatTime12Hour(booking.time)} (${booking.duration} mins)`,
    `💰 *Estimated Total:* ₹${booking.price}`,
  ];

  if (booking.notes) {
    lines.push(`📝 *Notes:* ${booking.notes}`);
  }

  lines.push(
    `----------------------------------------`,
    `_Established 1998 • Sachin Mahaley_`,
    `_Thank you for choosing Champion Hair Salon!_`
  );

  return lines.join("\n");
}

/**
 * Generates quick general enquiry WhatsApp message
 */
export function generateEnquiryWhatsAppMessage(customerName?: string, query?: string): string {
  if (query && customerName) {
    return `Hi Champion Hair Salon, I am ${customerName}. ${query}`;
  }
  return `Hi Champion Hair Salon, I would like to inquire about appointments and grooming services.`;
}
