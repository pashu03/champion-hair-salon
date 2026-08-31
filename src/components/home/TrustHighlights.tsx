import React from "react";
import { Scissors, Award, Sparkles } from "lucide-react";
import { Card } from "../ui/Card";

export const TrustHighlights = () => {
  const highlights = [
    {
      icon: <Scissors className="w-7 h-7 text-[#D4AF37]" />,
      title: "Expert Barbers",
      subtitle: "Skilled Craftsmen",
      description:
        "Master barber Sachin Mahaley and experienced stylists with over 28 years of precision grooming expertise.",
    },
    {
      icon: <Award className="w-7 h-7 text-[#D4AF37]" />,
      title: "Since 1998",
      subtitle: "Generations of Trust",
      description:
        "Proudly serving the local community with authentic care, consistency, and happy client faces for decades.",
    },
    {
      icon: <Sparkles className="w-7 h-7 text-[#D4AF37]" />,
      title: "Premium Quality",
      subtitle: "Attention to Detail",
      description:
        "Sanitized equipment, branded grooming products, razor-sharp finishes, and rejuvenating relaxation treatments.",
    },
  ];

  return (
    <section className="py-12 bg-[#0A0A0A] border-y border-white/5 relative z-10" data-reveal>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-stagger>
          {highlights.map((item, index) => (
            <Card
              key={index}
              data-stagger-item
              hoverEffect
              className="bg-[#121212] border-white/5 p-6 flex flex-col items-start gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-[#1A1A1A] border border-[#D4AF37]/30 flex items-center justify-center shadow-inner">
                {item.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  {item.subtitle}
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-[#8E8E8E] leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
