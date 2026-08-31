"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageSquare, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";

export const MobileBottomBar = () => {
  const pathname = usePathname();

  // Hide sticky bottom bar on admin routes and during active booking step flow if preferred
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="mobile-bottom-bar md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-white/10 px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto items-center">
        {/* One-Tap Call */}
        <a
          href="tel:+918888857057"
          className="flex flex-col items-center justify-center py-2 px-2 rounded-lg bg-[#161616] hover:bg-[#222222] border border-white/10 text-white transition-all active:scale-95 text-center"
          aria-label="Call +91 8888857057"
        >
          <Phone className="w-4 h-4 text-[#D4AF37] mb-1" />
          <span className="text-[11px] font-semibold tracking-wide">Call</span>
        </a>

        {/* Instant WhatsApp */}
        <a
          href="https://wa.me/918888857057?text=Hi%20Champion%20Hair%20Salon%2C%20I%20would%20like%20to%20inquire%20about%20an%20appointment."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-2 rounded-lg bg-[#161616] hover:bg-[#222222] border border-white/10 text-white transition-all active:scale-95 text-center"
          aria-label="WhatsApp"
        >
          <MessageSquare className="w-4 h-4 text-[#25D366] mb-1" />
          <span className="text-[11px] font-semibold tracking-wide">WhatsApp</span>
        </a>

        {/* Primary Book Now CTA */}
        <Link
          href="/book"
          className="flex flex-col items-center justify-center py-2 px-2 rounded-lg bg-gradient-to-r from-[#DFBA45] to-[#B89320] text-black font-bold shadow-[0_2px_10px_rgba(212,175,55,0.3)] transition-all active:scale-95 text-center"
        >
          <Calendar className="w-4 h-4 text-black mb-1" />
          <span className="text-[11px] font-extrabold uppercase tracking-wide">Book Now</span>
        </Link>
      </div>
    </div>
  );
};
