"use client";

import React, { useEffect, useState } from "react";
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
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/admin/login" && !session) {
      router.replace("/admin/login");
    }
  }, [pathname, router, session]);

  // If on login page, just render children without sidebar
  if (pathname === "/admin/login") {
    return <div className="admin-shell min-h-screen bg-[#050505] text-white">{children}</div>;
  }

  // If not authenticated and not on login, redirect to login
  if (!session) {
    return (
      <div className="admin-shell min-h-screen bg-[#090c11] text-white flex items-center justify-center">
        <p className="text-sm font-medium text-[#A9AFB8]">Opening secure admin login...</p>
      </div>
    );
  }

  return (
    <div className="admin-shell min-h-screen bg-[#090c11] text-[#F7F4EC] flex">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <AdminHeader
          onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
          session={session}
        />
        <main className="relative flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};
