import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ServicesList } from "@/components/services/ServicesList";
import { Scissors, ShieldCheck, Sparkles } from "lucide-react";
import { fallbackServices, withPublicFallback } from "@/lib/public-fallback-data";

export const metadata: Metadata = {
  title: "Grooming Services & Rate Card",
  description:
    "Explore our complete services menu: Hair cutting (₹120), Beard shaping (₹70), Hair colour, Ayurvedic head massages, and deep-cleansing facials.",
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await withPublicFallback(
    "services",
    () =>
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { price: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          description: true,
          price: true,
          duration: true,
          isPopular: true,
        },
      }),
    fallbackServices
  );

  return (
    <div className="pt-28 pb-24 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <Scissors className="w-4 h-4" />
            <span>Official Salon Menu</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            Grooming Services & Rates
          </h1>
          <p className="text-base sm:text-lg text-[#B5B5B5] leading-relaxed">
            Honest rates, premium craftsmanship, and genuine hospitality. All prices are verified from our official rate board.
          </p>

          <div className="inline-flex items-center gap-4 pt-2 text-xs text-[#8E8E8E]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> 100% Sanitized Tools
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Quality Branded Products
            </span>
          </div>
        </div>

        {/* Dynamic Services Tabs & Grid */}
        <ServicesList services={services} />
      </div>
    </div>
  );
}
