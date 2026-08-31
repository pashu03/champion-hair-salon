import React from "react";
import { Metadata } from "next";
import { CustomersManagerClient } from "@/components/admin/CustomersManagerClient";

export const metadata: Metadata = {
  title: "Admin Customer Directory",
  description: "View customer database and visit histories.",
};

export const dynamic = "force-dynamic";

export default function CustomersAdminPage() {
  return <CustomersManagerClient />;
}
