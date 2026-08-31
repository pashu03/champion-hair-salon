import { describe, it, expect } from "vitest";
import {
  bookingFormSchema,
  adminLoginSchema,
  serviceSchema,
} from "../src/lib/validations";

describe("Validation Schemas", () => {
  it("validates valid booking submissions successfully", () => {
    const validData = {
      serviceId: "srv-hair-cut",
      staffId: "staff-sachin-mahaley",
      date: "2026-09-01",
      time: "10:30",
      name: "Sachin Tendulkar",
      phone: "9876543210",
      email: "sachin@example.com",
      notes: "First time visit",
    };

    const result = bookingFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects booking submissions with invalid date or phone", () => {
    const invalidPhone = {
      serviceId: "srv-hair-cut",
      date: "2026-09-01",
      time: "10:30",
      name: "Sachin",
      phone: "123", // too short
    };

    const phoneResult = bookingFormSchema.safeParse(invalidPhone);
    expect(phoneResult.success).toBe(false);

    const invalidDate = {
      serviceId: "srv-hair-cut",
      date: "01-09-2026", // wrong format, expects YYYY-MM-DD
      time: "10:30",
      name: "Sachin",
      phone: "9876543210",
    };

    const dateResult = bookingFormSchema.safeParse(invalidDate);
    expect(dateResult.success).toBe(false);
  });

  it("validates admin login credentials schema", () => {
    const validLogin = {
      email: "admin@championhairsalon.com",
      password: "Champion@1998",
    };
    expect(adminLoginSchema.safeParse(validLogin).success).toBe(true);

    const invalidEmail = {
      email: "not-an-email",
      password: "123",
    };
    expect(adminLoginSchema.safeParse(invalidEmail).success).toBe(false);
  });

  it("validates service creation and ensures price and duration constraints", () => {
    const validService = {
      name: "O+3 Facial Regular",
      category: "Face Massage & Facials",
      price: "1000",
      duration: "60",
      description: "Premium oxygenating facial",
      isPopular: true,
      isActive: true,
      displayOrder: 1,
    };
    const res = serviceSchema.safeParse(validService);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.price).toBe(1000);
      expect(res.data.duration).toBe(60);
    }
  });
});
