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
    <header className="h-16 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg bg-[#1A1A1A] text-white border border-white/10"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-bold font-display text-white">
          {title || "Admin Control Center"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#8E8E8E] bg-[#161616] px-3 py-1.5 rounded-lg border border-white/5">
          <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{todayStr}</span>
        </div>

        <Link href="/" target="_blank" className="hidden sm:block">
          <Button
            size="sm"
            variant="secondary"
            className="text-xs"
            rightIcon={<ExternalLink className="w-3 h-3 text-[#D4AF37]" />}
          >
            Live Site
          </Button>
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{session.name}</p>
            <p className="text-[10px] text-[#D4AF37] leading-tight">
              {session.role === "ADMIN" ? "Master Admin" : session.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
