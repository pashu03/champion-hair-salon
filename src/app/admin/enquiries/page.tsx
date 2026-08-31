import React from "react";
import { Metadata } from "next";
import { EnquiriesManagerClient } from "@/components/admin/EnquiriesManagerClient";

export const metadata: Metadata = {
  title: "Admin Contact Enquiries",
  description: "Manage and reply to customer contact requests.",
};

export const dynamic = "force-dynamic";

export default function EnquiriesAdminPage() {
  return <EnquiriesManagerClient />;
}
