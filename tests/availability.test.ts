import { describe, it, expect } from "vitest";
import {
  timeToMinutes,
  minutesToTime,
  isOverlapping,
} from "../src/lib/availability";
import { generateAppointmentNumber } from "../src/lib/booking-id";
import {
  createWhatsAppUrl,
  generateBookingVoucherMessage,
} from "../src/lib/whatsapp";

describe("Availability & Time Calculation Utilities", () => {
  it("converts HH:mm time string to minutes correctly", () => {
    expect(timeToMinutes("09:00")).toBe(540);
    expect(timeToMinutes("13:30")).toBe(810);
    expect(timeToMinutes("21:00")).toBe(1260);
    expect(timeToMinutes("00:00")).toBe(0);
  });

  it("converts minutes from midnight to HH:mm correctly", () => {
    expect(minutesToTime(540)).toBe("09:00");
    expect(minutesToTime(810)).toBe("13:30");
    expect(minutesToTime(1260)).toBe("21:00");
    expect(minutesToTime(0)).toBe("00:00");
  });

  it("detects time intervals overlap accurately", () => {
    // [09:00, 09:30] and [09:15, 09:45] -> Overlap
    expect(isOverlapping(540, 570, 555, 585)).toBe(true);

    // [09:00, 09:30] and [09:30, 10:00] -> Adjacent (NO overlap)
    expect(isOverlapping(540, 570, 570, 600)).toBe(false);

    // [09:00, 09:30] and [10:00, 10:30] -> Completely separate (NO overlap)
    expect(isOverlapping(540, 570, 600, 630)).toBe(false);

    // [09:00, 10:00] and [09:15, 09:45] -> Enclosed (Overlap)
    expect(isOverlapping(540, 600, 555, 585)).toBe(true);
  });

  it("generates structured appointment numbers with year prefix", () => {
    const currentYear = new Date().getFullYear();
    const apptNum = generateAppointmentNumber();
    expect(apptNum).toMatch(new RegExp(`^CH-${currentYear}-\\d{6}$`));
  });

  it("formats WhatsApp booking vouchers with all required details", () => {
    const voucher = generateBookingVoucherMessage({
      appointmentNumber: "CH-2026-123456",
      customerName: "Rahul Sharma",
      customerPhone: "9876543210",
      serviceName: "Hair Cut",
      barberName: "Sachin Mahaley",
      date: "2026-09-01",
      time: "11:00",
      duration: 30,
      price: 120,
      notes: "Please trim sides short",
    });

    expect(voucher).toContain("CH-2026-123456");
    expect(voucher).toContain("Rahul Sharma");
    expect(voucher).toContain("Hair Cut");
    expect(voucher).toContain("Sachin Mahaley");
    expect(voucher).toContain("₹120");
    expect(voucher).toContain("Please trim sides short");
  });

  it("creates valid WhatsApp click-to-chat URLs", () => {
    const url = createWhatsAppUrl("918888857057", "Hello Champion Salon");
    expect(url).toContain("https://wa.me/918888857057");
    expect(url).toContain("Hello%20Champion%20Salon");
  });
});
