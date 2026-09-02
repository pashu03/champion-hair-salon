"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  CalendarDays,
  Clock,
  Database,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Scissors,
  Settings,
  Star,
  UserCheck,
  Users,
  X,
} from "lucide-react";

const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/admin/appointments", icon: CalendarDays },
  { name: "Calendar View", href: "/admin/calendar", icon: Calendar },
  { name: "Services & Rates", href: "/admin/services", icon: Layers },
  { name: "Staff & Barbers", href: "/admin/staff", icon: Users },
  { name: "Salon Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "Contact Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { name: "Business Hours", href: "/admin/business-hours", icon: Clock },
  { name: "Customer Database", href: "/admin/customers", icon: UserCheck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "System & Database", href: "/admin/system", icon: Database },
];

export const AdminSidebar = ({
  isMobileOpen,
  onCloseMobile,
}: {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/[0.08] bg-[#0E1218]/98 shadow-[18px_0_45px_rgba(0,0,0,0.2)] transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#2A2415] to-[#17150F] text-[#E3BD48] shadow-[0_0_24px_rgba(212,175,55,0.1)]">
                <Scissors className="h-[18px] w-[18px] -rotate-45" />
              </span>
              <span>
                <span className="block font-display text-[17px] font-bold leading-none tracking-[0.08em] text-white">
                  CHAMPION
                </span>
                <span className="mt-1.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Admin Portal · 1998
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-2 text-[#AAB0BA] transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="admin-scrollbar flex-1 overflow-y-auto p-4">
            <p className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#6F7783]">
              Salon management
            </p>
            <div className="space-y-1">
              {ADMIN_NAV.map((item) => {
                const isActive =
                  item.href === "/admin/dashboard"
                    ? pathname === "/admin/dashboard"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onCloseMobile}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-all ${
                      isActive
                        ? "border-[#D4AF37]/20 bg-[#D4AF37]/14 text-[#F4D572] shadow-[inset_3px_0_0_#D4AF37]"
                        : "border-transparent text-[#AEB4BD] hover:border-white/[0.06] hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] ${
                        isActive ? "text-[#E1B83F]" : "text-[#8F98A5]"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="shrink-0 space-y-2 border-t border-white/[0.08] bg-[#0A0E14] p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium text-[#B5BBC4] transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-[#D4AF37]" />
              View Public Website
            </span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-emerald-300">
              Live
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
