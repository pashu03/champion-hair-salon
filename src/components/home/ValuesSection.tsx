import React from "react";
import { Award, Users, Flame, Lightbulb } from "lucide-react";
import { Card } from "../ui/Card";

export const ValuesSection = () => {
  const values = [
    {
      icon: <Award className="w-6 h-6 text-[#D4AF37]" />,
      title: "Excellence",
      description: "Committed to delivering unwavering quality and meticulous attention in every service.",
    },
    {
      icon: <Users className="w-6 h-6 text-[#D4AF37]" />,
      title: "Community",
      description: "Building generational relationships and earning the lasting trust of our neighborhood.",
    },
    {
      icon: <Flame className="w-6 h-6 text-[#D4AF37]" />,
      title: "Passion",
      description: "A deep, genuine love for professional barbering craftsmanship and client styling.",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-[#D4AF37]" />,
      title: "Innovation",
      description: "Harmoniously combining traditional Indian barbering with modern trends and skincare techniques.",
    },
  ];

  return (
    <section className="py-20 bg-[#0A0A0A] border-t border-white/5 relative z-10" data-reveal>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Core Principles
          </span>
          <h2 className="text-3xl font-bold font-display text-white">
            Our Guiding Values
          </h2>
          <p className="text-sm text-[#8E8E8E]">
            The foundation of everything Sachin Mahaley and Champion Hair Salon stand for since 1998.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-stagger>
          {values.map((v, i) => (
            <Card
              key={i}
              data-stagger-item
              hoverEffect
              className="bg-[#141414] border-white/5 p-6 text-center flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="text-lg font-bold font-display text-white">
                {v.title}
              </h3>
              <p className="text-xs text-[#8E8E8E] leading-relaxed">
                {v.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
