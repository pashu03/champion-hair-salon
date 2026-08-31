import React from "react";
import Link from "next/link";
import { Award, Calendar, MessageSquare } from "lucide-react";
import { Button } from "../ui/Button";
import { HeroScene } from "../three/HeroScene";

export const HeroSection = () => {
  return (
    <section className="hero-section relative flex min-h-[90vh] items-center overflow-hidden bg-[#050505] pb-16 pt-24 md:min-h-[92vh]" data-motion="none">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.07)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
      <div className="hero-grid-lines pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left" data-hero-copy>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#161616] px-3.5 py-1.5 shadow-sm">
              <Award className="h-4 w-4 text-[#D4AF37]" />
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Established 1998 • 28+ Years of Excellence</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Champion <br />
                <span className="bg-gradient-to-r from-[#DFBA45] via-[#D4AF37] to-[#C9A227] bg-clip-text text-transparent">Hair Salon</span>
              </h1>
              <p className="font-display text-lg font-medium italic text-[#D4AF37] sm:text-xl">Where Tradition Meets Excellence in Men&apos;s Grooming</p>
            </div>

            <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed text-[#B5B5B5] sm:text-lg lg:mx-0">
              Experience authentic master barbering by <strong className="text-white">Sachin Mahaley</strong> and his expert team. From signature precision haircuts and beard sculpting to cooling head massages and rejuvenating facials.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
              <Link href="/book" className="w-full sm:w-auto">
                <Button size="lg" className="book-now-button w-full px-8 py-4 text-base sm:w-auto" leftIcon={<Calendar className="h-5 w-5" />}>Book Appointment</Button>
              </Link>
              <a href="https://wa.me/918888857057?text=Hi%20Champion%20Hair%20Salon%2C%20I%20would%20like%20to%20book%20an%20appointment." target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full px-6 py-4 text-base sm:w-auto" leftIcon={<MessageSquare className="h-5 w-5 text-[#25D366]" />}>WhatsApp Us</Button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center lg:text-left">
              <div>
                <p className="font-display text-xl font-bold text-white sm:text-2xl" data-count="1998">1998</p>
                <p className="text-xs uppercase tracking-wider text-[#8E8E8E]">Founded</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-[#D4AF37] sm:text-2xl">₹120</p>
                <p className="text-xs uppercase tracking-wider text-[#8E8E8E]">Haircut Starts</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white sm:text-2xl" data-count="7" data-count-suffix=" Days">7 Days</p>
                <p className="text-xs uppercase tracking-wider text-[#8E8E8E]">09 AM – 09 PM</p>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="hero-visual-shell relative mx-auto max-w-md overflow-hidden rounded-[1.6rem] border border-[#D4AF37]/35 bg-[#0A0A0A] shadow-2xl lg:max-w-none">
              <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-[#D4AF37]/25 bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37] backdrop-blur-md">Master barber craft</div>
              <HeroScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
