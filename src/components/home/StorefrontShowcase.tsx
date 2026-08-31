import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";

export const StorefrontShowcase = () => {
  return (
    <section className="py-20 bg-[#050505] relative z-10" data-reveal>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="storefront-panel rounded-2xl bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#D4AF37]/30 p-8 sm:p-12 overflow-hidden relative shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Storefront Photo */}
            <div className="lg:col-span-6 relative" data-parallax>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src="/images/salon-storefront.jpg"
                  alt="Real Champion Hair Salon storefront entrance"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
                <div className="absolute top-3 left-3 bg-[#050505]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  Real Storefront Photo
                </div>
              </div>
            </div>

            {/* Right Col: Details & Booking Callout */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  Visit Us Today
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Step Into Champion Hair Salon
                </h3>
                <p className="text-sm text-[#B5B5B5] leading-relaxed">
                  Clean, air-cooled, hygienic barber chairs ready for your visit. Walk-ins are always welcomed,
                  or reserve your preferred time slot online to skip the waiting line.
                </p>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-[#E0E0E0] pt-1">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Champion Hair Salon, Main Market, Maharashtra, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Call: +91 8888857057 / +91 9158846787</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Strict sanitation & single-use disposable blades for every client</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4">
                <Link href="/book">
                  <Button size="md" leftIcon={<Calendar className="w-4 h-4" />}>
                    Reserve Your Chair
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="md">
                    Get Driving Directions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
