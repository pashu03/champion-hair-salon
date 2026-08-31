import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Camera } from "lucide-react";
import { fallbackGalleryItems, withPublicFallback } from "@/lib/public-fallback-data";

export const metadata: Metadata = {
  title: "Salon Gallery & Hairstyles",
  description:
    "Explore Champion Hair Salon photo gallery: classic haircuts, beard sculpting styles, hair colour, and our authentic storefront since 1998.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const items = await withPublicFallback(
    "gallery",
    () =>
      prisma.galleryItem.findMany({
        where: { isPublished: true },
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          title: true,
          category: true,
          imageUrl: true,
          altText: true,
          isBeforeAfter: true,
        },
      }),
    fallbackGalleryItems
  );

  return (
    <div className="pt-28 pb-24 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <Camera className="w-4 h-4" />
            <span>Visual Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            Salon Gallery & Grooming Styles
          </h1>
          <p className="text-base sm:text-lg text-[#B5B5B5] leading-relaxed">
            A glimpse into our craftsmanship, salon atmosphere, and precision hair & beard transformations.
          </p>
        </div>

        <GalleryGrid items={items} />
      </div>
    </div>
  );
}
