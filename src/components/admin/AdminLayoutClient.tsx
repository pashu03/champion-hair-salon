"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { SessionUser } from "@/lib/auth";

export const AdminLayoutClient = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionUser | null;
}) => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If on login page, just render children without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#050505] text-white">{children}</div>;
  }

  // If not authenticated and not on login, redirect to login
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <p className="text-sm text-[#8E8E8E]">Redirecting to admin login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <AdminHeader onToggleMobile={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
