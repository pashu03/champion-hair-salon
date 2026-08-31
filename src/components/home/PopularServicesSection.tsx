import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Sparkles, Scissors } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export interface ServiceItemProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number;
  duration: number;
  isPopular: boolean;
}

export const PopularServicesSection = ({ services }: { services: ServiceItemProps[] }) => {
  return (
    <section className="py-20 bg-[#050505] relative z-10" data-reveal>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>Signature Grooming</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Our Popular Services
            </h2>
            <p className="text-[#8E8E8E] text-base max-w-xl">
              Transparent, honest salon pricing from our official rate board. Select any service to book in seconds.
            </p>
          </div>

          <Link href="/services">
            <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All 23 Services
            </Button>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-stagger>
          {services.map((service) => (
            <Card
              key={service.id}
              data-stagger-item
              hoverEffect
              className="bg-[#141414] border-white/10 p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Category & Popular badge */}
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

                {/* Service Name & Price */}
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold font-display text-white group-hover:text-[#D4AF37] transition-colors">
                    {service.name}
                  </h3>
                  <div className="text-xl font-bold text-[#D4AF37] shrink-0 font-display">
                    ₹{service.price}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#8E8E8E] leading-relaxed mb-6">
                  {service.description || "Expert grooming service tailored to your styling preferences."}
                </p>
              </div>

              {/* Bottom Row: Duration & Book CTA */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#8E8E8E]">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{service.duration} mins</span>
                </div>

                <Link href={`/book?service=${service.id}`}>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="group-hover:bg-[#D4AF37] group-hover:text-black group-hover:border-[#D4AF37] transition-all"
                    rightIcon={<Scissors className="w-3.5 h-3.5" />}
                  >
                    Book
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
