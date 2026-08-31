"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CameraOff, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText: string;
  isBeforeAfter?: boolean;
}

const CATEGORY_ORDER = ["Salon", "Haircuts", "Beard Styles", "Hair Colour", "Facials", "Before & After"];

function isSupportedImageSource(source: string) {
  return source.startsWith("/images/") || source.startsWith("https://images.unsplash.com/");
}

function ImageUnavailable({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#141414] p-6 text-center">
      <CameraOff className="h-8 w-8 text-[#D4AF37]" aria-hidden="true" />
      <p className="text-xs uppercase tracking-[0.18em] text-[#B5B5B5]">Image unavailable</p>
      <span className="sr-only">{title}</span>
    </div>
  );
}

export const GalleryGrid = ({ items }: { items: GalleryItem[] }) => {
  const categories = useMemo(() => {
    const available = new Set(items.map((item) => item.category));
    const ordered = CATEGORY_ORDER.filter((category) => available.has(category));
    const additional = Array.from(available).filter((category) => !CATEGORY_ORDER.includes(category));
    return ["All", ...ordered, ...additional];
  }, [items]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredItems = activeCategory === "All"
    ? items
    : items.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase());

  const currentItem = selectedItemIndex === null ? null : filteredItems[selectedItemIndex];

  const markImageFailed = (id: string) => {
    setFailedImages((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  };

  const moveLightbox = useCallback((direction: -1 | 1) => {
    if (!filteredItems.length) return;
    setSelectedItemIndex((current) => {
      if (current === null) return null;
      return (current + direction + filteredItems.length) % filteredItems.length;
    });
  }, [filteredItems.length]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup = () => {};

    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const cards = grid.querySelectorAll("[data-gallery-item]");
      const tween = gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 18, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.06, ease: "power2.out" }
      );
      cleanup = () => tween.kill();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [activeCategory]);

  useEffect(() => {
    if (selectedItemIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedItemIndex(null);
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedItemIndex, moveLightbox]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-start gap-2 overflow-x-auto pb-2 sm:justify-center" aria-label="Gallery categories">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setSelectedItemIndex(null);
              }}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 sm:text-sm ${
                isActive
                  ? "bg-[#D4AF37] text-black shadow-[0_2px_12px_rgba(212,175,55,0.35)]"
                  : "border border-white/5 bg-[#141414] text-[#B5B5B5] hover:bg-[#1E1E1E] hover:text-white"
              }`}
              aria-pressed={isActive}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {filteredItems.map((item, index) => {
          const canRenderImage = isSupportedImageSource(item.imageUrl) && !failedImages.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              data-gallery-item
              onClick={() => setSelectedItemIndex(index)}
              className="gallery-card always-dark group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#141414] text-left shadow-lg transition-all duration-300 hover:border-[#D4AF37]/50 focus-visible:border-[#D4AF37]"
              aria-label={`Open ${item.title}`}
            >
              {canRenderImage ? (
                <Image
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  onError={() => markImageFailed(item.id)}
                />
              ) : (
                <ImageUnavailable title={item.title} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <span className="self-end rounded-full border border-[#D4AF37]/30 bg-black/60 p-2 text-[#D4AF37] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
                <div>
                  <span className="rounded border border-[#D4AF37]/20 bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">{item.category}</span>
                  <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-white">{item.title}</h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!filteredItems.length && (
        <div className="rounded-2xl border border-white/10 bg-[#141414] px-6 py-14 text-center">
          <CameraOff className="mx-auto h-9 w-9 text-[#D4AF37]" />
          <h3 className="mt-4 font-display text-xl font-bold text-white">No published images yet</h3>
          <p className="mt-2 text-sm text-[#8E8E8E]">New verified salon work will appear here when it is published.</p>
        </div>
      )}

      {currentItem && (
        <div
          className="always-dark fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-lightbox-title"
          onClick={() => setSelectedItemIndex(null)}
        >
          <button type="button" onClick={() => setSelectedItemIndex(null)} className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6" aria-label="Close gallery image">
            <X className="h-6 w-6" />
          </button>

          {filteredItems.length > 1 && (
            <>
              <button type="button" onClick={(event) => { event.stopPropagation(); moveLightbox(-1); }} className="absolute left-3 z-20 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:left-8" aria-label="Previous image">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" onClick={(event) => { event.stopPropagation(); moveLightbox(1); }} className="absolute right-3 z-20 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:right-8" aria-label="Next image">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <div className="relative max-h-[70vh] w-full overflow-hidden rounded-xl border border-white/10 aspect-[4/3] sm:aspect-[16/10]">
              {isSupportedImageSource(currentItem.imageUrl) && !failedImages.has(currentItem.id) ? (
                <Image src={currentItem.imageUrl} alt={currentItem.altText || currentItem.title} fill className="object-contain" sizes="100vw" onError={() => markImageFailed(currentItem.id)} />
              ) : (
                <ImageUnavailable title={currentItem.title} />
              )}
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">{currentItem.category}</span>
              <h4 id="gallery-lightbox-title" className="mt-0.5 font-display text-lg font-bold text-white">{currentItem.title}</h4>
              <p className="mt-1 text-xs text-[#8E8E8E]">{(selectedItemIndex ?? 0) + 1} of {filteredItems.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
