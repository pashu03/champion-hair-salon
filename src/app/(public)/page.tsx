import React from "react";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustHighlights } from "@/components/home/TrustHighlights";
import { PopularServicesSection } from "@/components/home/PopularServicesSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { StorySection } from "@/components/home/StorySection";
import { ValuesSection } from "@/components/home/ValuesSection";
import { StorefrontShowcase } from "@/components/home/StorefrontShowcase";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import {
  fallbackServices,
  fallbackTestimonials,
  withPublicFallback,
} from "@/lib/public-fallback-data";

export const revalidate = 60; // ISR revalidate every 60s

export default async function HomePage() {
  // Fetch popular services
  const popularServices = await withPublicFallback(
    "popular services",
    () =>
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: [{ isPopular: "desc" }, { displayOrder: "asc" }],
        take: 6,
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
    fallbackServices.filter((service) => service.isPopular).slice(0, 6)
  );

  // Fetch featured testimonials
  const testimonials = await withPublicFallback(
    "featured testimonials",
    () =>
      prisma.testimonial.findMany({
        where: { isPublished: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        take: 3,
        select: {
          id: true,
          customerName: true,
          rating: true,
          review: true,
          serviceName: true,
          date: true,
        },
      }),
    fallbackTestimonials
  );

  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrustHighlights />
      <PopularServicesSection services={popularServices} />
      <WhyChooseSection />
      <StorySection />
      <StorefrontShowcase />
      <ValuesSection />
      <TestimonialsSection testimonials={testimonials} />
    </div>
  );
}
