import React from "react";
import { Metadata } from "next";
import { BusinessHoursClient } from "@/components/admin/BusinessHoursClient";

export const metadata: Metadata = {
  title: "Admin Business Hours",
  description: "Configure salon opening hours and breaks.",
};

export const dynamic = "force-dynamic";

export default function BusinessHoursAdminPage() {
  return <BusinessHoursClient />;
}
