import React from "react";
import { Metadata } from "next";
import { StaffManagerClient } from "@/components/admin/StaffManagerClient";

export const metadata: Metadata = {
  title: "Admin Staff & Barbers",
  description: "Manage barber profiles, active status and shifts.",
};

export const dynamic = "force-dynamic";

export default function StaffAdminPage() {
  return <StaffManagerClient />;
}
