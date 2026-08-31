"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scissors, Menu, X, Phone, MessageSquare, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../theme/ThemeToggle";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "is-scrolled bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-xl py-3"
          : "bg-gradient-to-b from-black/90 via-black/60 to-transparent py-4 md:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:scale-105 transition-all">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg sm:text-xl font-bold tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
                CHAMPION
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                1998
              </span>
            </div>
            <span className="text-[11px] tracking-[0.25em] text-[#B5B5B5] uppercase font-sans">
              HAIR SALON
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`premium-nav-link relative px-3.5 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive
                    ? "text-[#D4AF37]"
                    : "text-[#B5B5B5] hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle compact />
          <a
            href="https://wa.me/918888857057"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-[#161616] text-[#25D366] hover:bg-[#25D366]/10 border border-white/10 hover:border-[#25D366]/40 transition-all"
            title="Chat on WhatsApp (+91 8888857057)"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          <a
            href="tel:+918888857057"
            className="p-2.5 rounded-lg bg-[#161616] text-[#B5B5B5] hover:text-white hover:bg-white/5 border border-white/10 transition-all"
            title="Call Salon (+91 8888857057)"
            aria-label="Call salon"
          >
            <Phone className="w-4 h-4" />
          </a>

          <Link href="/book">
            <Button size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
              BOOK NOW
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle compact />
          <Link href="/book">
            <Button size="sm" className="px-3 py-1.5 text-xs">
              Book
            </Button>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-[#161616] text-white border border-white/10 hover:border-[#D4AF37]/40 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-panel md:hidden fixed inset-x-0 top-[60px] bg-[#0A0A0A]/98 backdrop-blur-xl border-b border-white/10 p-6 shadow-2xl flex flex-col space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all ${
                    isActive
                      ? "bg-[#D4AF37]/15 text-[#D4AF37] font-semibold border-l-4 border-[#D4AF37]"
                      : "text-[#B5B5B5] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/918888857057"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#161616] text-emerald-400 border border-emerald-900/40 text-sm font-medium hover:bg-emerald-950/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+918888857057"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#161616] text-white border border-white/10 text-sm font-medium hover:bg-white/5"
              >
                <Phone className="w-4 h-4" />
                <span>Call Salon</span>
              </a>
            </div>

            <Link href="/book" className="block w-full">
              <Button className="w-full justify-center py-3 text-base" leftIcon={<Calendar className="w-5 h-5" />}>
                BOOK APPOINTMENT
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
