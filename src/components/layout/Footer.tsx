import React from "react";
import Link from "next/link";
import { Scissors, Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-16 pb-24 md:pb-12 text-[#B5B5B5] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Col 1: Brand & Legacy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#161616] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-wider text-white">
                  CHAMPION
                </span>
                <p className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase font-semibold">
                  HAIR SALON • SINCE 1998
                </p>
              </div>
            </div>

            <p className="text-sm text-[#8E8E8E] leading-relaxed">
              Founded in 1998 by <span className="text-white font-medium">Sachin Mahaley</span>.
              Combining traditional Indian barber craftsmanship with modern grooming excellence for over 28 years.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" />
              <span>Hygienic, Sanitized & Premium Tools</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-[#D4AF37] pl-3 font-sans">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-[#D4AF37] transition-colors">
                  Our Services & Rates
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#D4AF37] transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                  Founder Story & Legacy
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#D4AF37] transition-colors">
                  Salon Gallery & Styles
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#D4AF37] transition-colors">
                  Customer Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                  Contact & Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Business Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-[#D4AF37] pl-3 font-sans">
              Working Hours
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-medium">Monday – Sunday</p>
                  <p className="text-[#8E8E8E]">09:00 AM – 09:00 PM</p>
                  <p className="text-xs text-[#D4AF37] mt-1 font-sans">Open All 7 Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Owner Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-[#D4AF37] pl-3 font-sans">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+918888857057" className="text-white hover:text-[#D4AF37] transition-colors">
                    +91 8888857057
                  </a>
                  <a href="tel:+919158846787" className="text-xs text-[#8E8E8E] hover:text-[#D4AF37] transition-colors">
                    +91 9158846787
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href="mailto:info@championhairsalon.com"
                  className="hover:text-[#D4AF37] transition-colors truncate"
                >
                  info@championhairsalon.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  Champion Hair Salon, Main Market, Maharashtra, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <p>© {currentYear} Champion Hair Salon. Established 1998 by Sachin Mahaley. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" /> for Gentlemen
            </span>
            <span className="text-white/20">|</span>
            <Link
              href="/admin/login"
              className="text-[#606060] hover:text-[#D4AF37] transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
