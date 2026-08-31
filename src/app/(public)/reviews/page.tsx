import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ReviewsClient } from "@/components/reviews/ReviewsClient";
import { Star, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Reviews & Testimonials",
  description:
    "Read genuine reviews and experiences from loyal patrons of Champion Hair Salon and master barber Sachin Mahaley.",
};

export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      customerName: true,
      rating: true,
      review: true,
      serviceName: true,
      date: true,
    },
  });

  return (
    <div className="pt-28 pb-24 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <Star className="w-4 h-4 fill-[#D4AF37]" />
            <span>Community Feedback</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            Customer Testimonials
          </h1>
          <p className="text-base sm:text-lg text-[#B5B5B5] leading-relaxed">
            Generations of satisfaction. See what our regular gentlemen say about our haircuts, shaves, and salon atmosphere.
          </p>
        </div>

        <ReviewsClient reviews={reviews} />
      </div>
    </div>
  );
}
