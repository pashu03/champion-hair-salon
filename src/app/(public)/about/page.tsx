import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Scissors, Award, Heart, CheckCircle2, Shield, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ValuesSection } from "@/components/home/ValuesSection";

export const metadata: Metadata = {
  title: "About Our Legacy Since 1998",
  description:
    "Learn about Sachin Mahaley and the 28-year craftsmanship heritage of Champion Hair Salon, established in 1998 in Maharashtra.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 bg-[#050505] min-h-screen space-y-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <Award className="w-4 h-4" />
            <span>ESTABLISHED 1998</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            Our Story & Barber Heritage
          </h1>
          <p className="text-base sm:text-lg text-[#B5B5B5] leading-relaxed">
            Over 28 years of master craftsmanship, unwavering community trust, and a passion for classic and contemporary men&apos;s styling.
          </p>
        </div>

        {/* Founder Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Real Founder Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-[#161616] border border-[#D4AF37]/40 shadow-2xl">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/images/sachin-mahaley.jpg"
                  alt="Sachin Mahaley, Founder and Head Barber at Champion Hair Salon"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  Founder & Master Barber
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-1">
                  Sachin Mahaley
                </h3>
                <p className="text-xs text-[#B5B5B5] mt-1">
                  Master of traditional razor craft & modern men&apos;s grooming
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-base text-[#B5B5B5] leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Craftsmanship Built on Trust & Happy Faces
              </h2>
              <p>
                In 1998, <strong className="text-white">Sachin Mahaley</strong> founded{" "}
                <strong className="text-white">Champion Hair Salon</strong> with a clear and simple mission:
                to provide every gentleman with exceptional hair grooming, razor-sharp precision, and sincere personal attention.
              </p>
              <p>
                Over nearly three decades, Champion Hair Salon has evolved into a beloved local landmark.
                Clients who first came as young boys now bring their own sons and grandsons, confident in the consistent quality and respectful service that defines the Champion experience.
              </p>
              <p>
                Whether you desire a timeless taper cut, a skin fade, sharp beard styling, a cooling Ayurvedic head massage, or a refreshing facial treatment, Sachin Mahaley and his team tailor each service to perfection.
              </p>
            </div>

            {/* Quote Card */}
            <div className="p-6 rounded-xl bg-[#141414] border-l-4 border-[#D4AF37] border-y border-r border-white/5 space-y-2">
              <p className="text-white font-display italic text-lg leading-snug">
                &ldquo;Our main motive is to provide better service and to see happy faces of my clients.&rdquo;
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                — Sachin Mahaley, Founder
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/book">
                <Button size="md" leftIcon={<Calendar className="w-4 h-4" />}>
                  Book with Sachin & Team
                </Button>
              </Link>
              <a href="tel:+918888857057">
                <Button variant="secondary" size="md" leftIcon={<Phone className="w-4 h-4" />}>
                  +91 8888857057
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Storefront & Atmosphere Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-white/5">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                The Salon Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Hygienic, Welcoming & Professional
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#B5B5B5] leading-relaxed">
              Step into a clean, air-cooled environment designed for your comfort. We maintain meticulous hygiene standards with freshly sanitized clippers, single-use disposable razor blades, sanitized salon capes, and hot towel treatments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-white">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Single-Use Razor Blades</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Sanitized Barber Stations</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Air-Cooled Comfort</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Open 7 Days a Week</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/salon-storefront.jpg"
                alt="Champion Hair Salon entrance and storefront"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 550px"
              />
            </div>
          </div>
        </div>
      </div>

      <ValuesSection />
    </div>
  );
}
