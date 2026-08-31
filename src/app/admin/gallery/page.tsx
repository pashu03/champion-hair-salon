import React from "react";
import { Metadata } from "next";
import { GalleryManagerClient } from "@/components/admin/GalleryManagerClient";

export const metadata: Metadata = {
  title: "Admin Gallery Management",
  description: "Manage salon photos, hairstyles and storefront imagery.",
};

export const dynamic = "force-dynamic";

export default function GalleryAdminPage() {
  return <GalleryManagerClient />;
}
