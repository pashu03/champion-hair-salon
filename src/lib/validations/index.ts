import { z } from "zod";

export const bookingFormSchema = z.object({
  serviceId: z.string().min(1, "Please select a grooming service"),
  staffId: z.string().optional().nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid booking date (YYYY-MM-DD)"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Please select a valid time slot (HH:mm)"),
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid 10-digit mobile number")
    .max(15, "Phone number is too long"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Please enter a valid admin email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const serviceSchema = z.object({
  name: z.string().trim().min(2, "Service name is required"),
  category: z.string().trim().min(2, "Category is required"),
  price: z.coerce.number().int().positive("Price must be a positive integer"),
  duration: z.coerce.number().int().min(5, "Duration must be at least 5 minutes"),
  description: z.string().trim().optional().or(z.literal("")),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const staffSchema = z.object({
  name: z.string().trim().min(2, "Barber name is required"),
  role: z.string().trim().min(2, "Role/Title is required"),
  phone: z.string().trim().optional().or(z.literal("")),
  photo: z.string().trim().optional().or(z.literal("")),
  bio: z.string().trim().optional().or(z.literal("")),
  specialties: z.string().trim().min(2, "Specialties are required"),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
});

export type StaffInput = z.infer<typeof staffSchema>;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().min(10, "Please enter a valid mobile number"),
  email: z.string().trim().email("Please enter a valid email").optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message must be at least 5 characters"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const testimonialSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required"),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().trim().min(5, "Review must be at least 5 characters"),
  serviceName: z.string().trim().optional().or(z.literal("")),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const settingsSchema = z.object({
  salonName: z.string().trim().min(2),
  tagline: z.string().trim().min(2),
  ownerName: z.string().trim().min(2),
  phone: z.string().trim().min(8),
  altPhone: z.string().trim().optional().or(z.literal("")),
  whatsappNumber: z.string().trim().min(8),
  email: z.string().trim().email(),
  address: z.string().trim().min(5),
  city: z.string().trim().min(2),
  googleMapsEmbedUrl: z.string().trim().optional().or(z.literal("")),
  googleReviewUrl: z.string().trim().optional().or(z.literal("")),
  instagramUrl: z.string().trim().optional().or(z.literal("")),
  facebookUrl: z.string().trim().optional().or(z.literal("")),
  slotInterval: z.coerce.number().int().min(10).max(120),
  advanceNoticeHours: z.coerce.number().int().min(0).max(48),
  maxAdvanceDays: z.coerce.number().int().min(1).max(180),
  cancellationHours: z.coerce.number().int().min(0).max(48),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
