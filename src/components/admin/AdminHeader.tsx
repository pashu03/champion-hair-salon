"use client";

import React from "react";
import Link from "next/link";
import { Menu, ExternalLink, Calendar as CalendarIcon, User } from "lucide-react";
import { Button } from "../ui/Button";
import type { SessionUser } from "@/lib/auth";

export const AdminHeader = ({
  onToggleMobile,
  title,
  session,
}: {
  onToggleMobile: () => void;
  title?: string;
  session: SessionUser;
}) => {
  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="h-18 sm:h-20 bg-[#0D1117]/92 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2.5 rounded-xl bg-[#171C24] text-white border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <p className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
            Champion Hair Salon
          </p>
          <h1 className="text-base sm:text-lg font-bold font-display text-white leading-tight">
            {title || "Admin workspace"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[#C2C7CF] bg-[#151A22] px-3.5 py-2 rounded-xl border border-white/[0.08]">
          <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
          <span>{todayStr}</span>
        </div>

        <Link href="/" target="_blank" className="hidden sm:block">
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-xl text-xs bg-[#171C24]"
            rightIcon={<ExternalLink className="w-3 h-3 text-[#D4AF37]" />}
          >
            Live Site
          </Button>
        </Link>

        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-white/10">
          <div className="w-9 h-9 rounded-xl bg-[#211D12] border border-[#D4AF37]/35 flex items-center justify-center text-[#E0B941] shadow-[0_0_18px_rgba(212,175,55,0.08)]">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{session.name}</p>
            <p className="text-[10px] font-semibold text-[#D4AF37] leading-tight mt-0.5">
              {session.role === "ADMIN" ? "Master Admin" : session.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
