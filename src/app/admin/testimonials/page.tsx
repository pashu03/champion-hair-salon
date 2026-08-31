import React from "react";
import { Metadata } from "next";
import { TestimonialsManagerClient } from "@/components/admin/TestimonialsManagerClient";

export const metadata: Metadata = {
  title: "Admin Testimonials",
  description: "Manage client reviews and homepage testimonials.",
};

export const dynamic = "force-dynamic";

export default function TestimonialsAdminPage() {
  return <TestimonialsManagerClient />;
}
