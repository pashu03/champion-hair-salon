import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Scissors, Quote, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";

export const StorySection = () => {
  return (
    <section className="py-20 bg-[#0A0A0A] border-y border-white/5 relative z-10 overflow-hidden" data-reveal>
      {/* Background Subtle Accent */}
      <div className="absolute -left-20 bottom-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Founder Photo */}
          <div className="lg:col-span-5 relative" data-parallax>
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 via-transparent to-[#D4AF37]/20 blur-sm" />
              <div className="always-dark relative rounded-2xl overflow-hidden bg-[#161616] border border-[#D4AF37]/40 shadow-2xl">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src="/images/sachin-mahaley.jpg"
                    alt="Sachin Mahaley, Founder and Head Barber of Champion Hair Salon"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 450px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-6 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    Founder & Master Barber
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Sachin Mahaley
                  </h3>
                  <p className="text-xs text-[#B5B5B5]">
                    Serving the community with passion since 1998
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Founder Story & Real Quote */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                <Scissors className="w-4 h-4" />
                <span>Our Story</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
                A Legacy of Excellence Since 1998
              </h2>
            </div>

            <div className="space-y-4 text-base text-[#B5B5B5] leading-relaxed">
              <p>
                In 1998, <strong className="text-white">Sachin Mahaley</strong> founded{" "}
                <strong className="text-white">Champion Hair Salon</strong> with a simple vision:
                to provide excellent grooming with close attention to detail and genuine customer care.
              </p>
              <p>
                Over the years, Champion Hair Salon has become a trusted part of the local community,
                combining traditional barbering craftsmanship with modern grooming techniques.
              </p>
              <p>
                Today, the salon continues to serve generations of customers—fathers, sons, and
                grandfathers—who trust Champion with their everyday style.
              </p>
            </div>

            {/* Authentic Founder Quote Box */}
            <div className="p-6 rounded-xl bg-[#141414] border-l-4 border-[#D4AF37] border-y border-r border-white/5 relative">
              <Quote className="w-8 h-8 text-[#D4AF37]/30 absolute top-4 right-4" />
              <p className="text-white font-display italic text-lg sm:text-xl leading-snug">
                &ldquo;Our main motive is to provide better service and to see happy faces of my clients.&rdquo;
              </p>
              <p className="mt-3 text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                — Sachin Mahaley, Founder
              </p>
            </div>

            {/* Key Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-[#E0E0E0]">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Over 28 Years Continuous Operation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#E0E0E0]">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Thousands of Happy Loyal Clients</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#E0E0E0]">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Traditional Razor & Modern Fade Mastery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#E0E0E0]">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Authentic, Transparent Pricing</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/about">
                <Button variant="outline" size="md">
                  Read Full Heritage & Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
