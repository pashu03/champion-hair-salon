import React from "react";
import { Metadata } from "next";
import { ServicesManagerClient } from "@/components/admin/ServicesManagerClient";

export const metadata: Metadata = {
  title: "Admin Services & Rates",
  description: "Manage salon services, pricing and durations.",
};

export const dynamic = "force-dynamic";

export default function ServicesAdminPage() {
  return <ServicesManagerClient />;
}
