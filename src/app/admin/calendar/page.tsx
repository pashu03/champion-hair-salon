import React from "react";
import { Metadata } from "next";
import { CalendarClient } from "@/components/admin/CalendarClient";

export const metadata: Metadata = {
  title: "Admin Appointment Calendar",
  description: "Visual monthly and daily appointment schedule calendar for Champion Hair Salon.",
};

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  return <CalendarClient />;
}
