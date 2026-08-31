import React from "react";
import { Metadata } from "next";
import { SettingsClient } from "@/components/admin/SettingsClient";

export const metadata: Metadata = {
  title: "Admin Business Settings",
  description: "Configure salon contact, address and booking parameters.",
};

export const dynamic = "force-dynamic";

export default function SettingsAdminPage() {
  return <SettingsClient />;
}
