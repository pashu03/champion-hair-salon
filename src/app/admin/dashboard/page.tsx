import React from "react";
import { Metadata } from "next";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Champion Hair Salon administration overview and live schedule.",
};

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
