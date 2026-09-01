"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

export const FloatingWhatsApp = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <aside
      aria-label="Contact options"
      className="pointer-events-none fixed bottom-24 right-4 z-40 hidden md:block md:right-6 group"
    >
      <div className="always-dark pointer-events-none absolute bottom-[calc(100%+0.75rem)] right-0 hidden whitespace-nowrap rounded-full border border-white/10 bg-[#161616] px-3.5 py-1.5 text-xs font-medium text-[#FFFFFF] opacity-0 shadow-xl transition-all duration-300 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
        Chat with Sachin Mahaley & Team
      </div>

      <a
        href="https://wa.me/918888857057?text=Hi%20Champion%20Hair%20Salon%2C%20I%20would%20like%20to%20book%20an%20appointment."
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto relative flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Chat on WhatsApp (+91 8888857057)"
      >
        <MessageSquare className="w-7 h-7 fill-current" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4AF37] border-2 border-[#050505] rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4AF37] border-2 border-[#050505] rounded-full" />
      </a>
    </aside>
  );
};
