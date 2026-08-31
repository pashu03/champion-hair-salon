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
      className="hidden md:flex fixed bottom-6 right-6 z-40 items-center group"
    >
      <div className="always-dark mr-3 px-3.5 py-1.5 rounded-full bg-[#161616] text-[#FFFFFF] text-xs font-medium border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Chat with Sachin Mahaley & Team
      </div>

      <a
        href="https://wa.me/918888857057?text=Hi%20Champion%20Hair%20Salon%2C%20I%20would%20like%20to%20book%20an%20appointment."
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 relative focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Chat on WhatsApp (+91 8888857057)"
      >
        <MessageSquare className="w-7 h-7 fill-current" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4AF37] border-2 border-[#050505] rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4AF37] border-2 border-[#050505] rounded-full" />
      </a>
    </aside>
  );
};
