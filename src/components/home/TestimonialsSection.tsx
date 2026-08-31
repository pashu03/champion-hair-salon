"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Quote, Star } from "lucide-react";
import { Button } from "../ui/Button";

export interface TestimonialItemProps {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  serviceName: string | null;
  date: string | null;
}

export const TestimonialsSection = ({ testimonials }: { testimonials: TestimonialItemProps[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (testimonials.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const review = reviewRef.current;
    if (!review || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup = () => {};

    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const tween = gsap.fromTo(review, { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" });
      cleanup = () => tween.kill();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [activeIndex]);

  if (!testimonials.length) return null;
  const active = testimonials[activeIndex];
  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative z-10 border-t border-white/5 bg-[#0A0A0A] py-20" data-reveal>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              <Star className="h-4 w-4 fill-[#D4AF37]" />
              <span>Client Experiences</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Words From the Champion Chair</h2>
            <p className="max-w-xl text-base text-[#8E8E8E]">Published feedback from customers who chose Champion Hair Salon for their grooming.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/reviews"><Button variant="outline" size="sm">View All Reviews</Button></Link>
            <a href="https://search.google.com/local/writereview?placeid=championhairsalon" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5 text-[#D4AF37]" />}>Leave Google Review</Button>
            </a>
          </div>
        </div>

        <div className="testimonial-stage relative overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#141414] p-7 shadow-2xl sm:p-10">
          <Quote className="absolute right-8 top-7 h-16 w-16 text-[#D4AF37]/10" aria-hidden="true" />
          <div ref={reviewRef} className="relative z-10 max-w-4xl" aria-live="polite">
            <div className="mb-6 flex items-center gap-1 text-[#D4AF37]">
              {Array.from({ length: active.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
            </div>
            <blockquote className="font-display text-xl leading-relaxed text-white sm:text-2xl md:text-3xl">&ldquo;{active.review}&rdquo;</blockquote>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-white/5 pt-5">
              <div>
                <p className="font-display text-lg font-bold text-white">{active.customerName}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-[#8E8E8E]">{active.serviceName || "Champion client"}{active.date ? ` • ${active.date}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => move(-1)} className="premium-icon-button" aria-label="Previous testimonial"><ArrowLeft className="h-4 w-4" /></button>
                <span className="min-w-14 text-center text-xs tabular-nums text-[#8E8E8E]">{String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</span>
                <button type="button" onClick={() => move(1)} className="premium-icon-button" aria-label="Next testimonial"><ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
