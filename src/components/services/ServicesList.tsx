"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Scissors } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number;
  duration: number;
  isPopular: boolean;
}

export const ServicesList = ({ services }: { services: ServiceItem[] }) => {
  const categories = [
    "All",
    "Hair Cutting",
    "Shaving & Beard",
    "Hair Colour",
    "Head Massage",
    "Threading",
    "Face Massage & Facials",
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-10">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#D4AF37] text-black shadow-[0_2px_12px_rgba(212,175,55,0.35)]"
                  : "bg-[#141414] text-[#B5B5B5] hover:text-white hover:bg-[#1E1E1E] border border-white/5"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-stagger>
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            data-stagger-item
            hoverEffect
            className="bg-[#141414] border-white/10 p-6 flex flex-col justify-between group"
          >
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#8E8E8E]">
                  {service.category}
                </span>
                {service.isPopular && (
                  <Badge variant="gold" size="sm">
                    POPULAR
                  </Badge>
                )}
              </div>

              {/* Title & Price */}
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="text-xl font-bold font-display text-white group-hover:text-[#D4AF37] transition-colors">
                  {service.name}
                </h3>
                <div className="text-2xl font-bold text-[#D4AF37] font-display shrink-0">
                  ₹{service.price}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#8E8E8E] leading-relaxed mb-6">
                {service.description || "Expert grooming service tailored to your styling preferences."}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#8E8E8E]">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{service.duration} mins</span>
              </div>

              <Link href={`/book?service=${service.id}`}>
                <Button
                  size="sm"
                  className="px-4"
                  rightIcon={<Scissors className="w-3.5 h-3.5" />}
                >
                  Book Service
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-16 bg-[#141414] rounded-2xl border border-white/5 space-y-3">
          <Scissors className="w-10 h-10 text-[#737373] mx-auto" />
          <h3 className="text-lg font-bold text-white">No services found in this category</h3>
          <p className="text-sm text-[#8E8E8E]">Try selecting another category above.</p>
        </div>
      )}
    </div>
  );
};
