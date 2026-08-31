import React from "react";
import { Metadata } from "next";
import { AppointmentsClient } from "@/components/admin/AppointmentsClient";

export const metadata: Metadata = {
  title: "Admin Appointments",
  description: "Manage bookings, search appointments and update status.",
};

export const dynamic = "force-dynamic";

export default function AppointmentsPage() {
  return <AppointmentsClient />;
}
