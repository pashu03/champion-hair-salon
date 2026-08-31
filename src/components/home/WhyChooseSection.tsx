import React from "react";
import { Scissors, Sparkles, HeartHandshake, Shield, UserCheck, Clock } from "lucide-react";
import { Card } from "../ui/Card";

export const WhyChooseSection = () => {
  const reasons = [
    {
      icon: <Clock className="w-5 h-5 text-[#D4AF37]" />,
      title: "Serving Since 1998",
      description: "Over 28 years of trusted barbering heritage serving multiple generations of families.",
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#D4AF37]" />,
      title: "Experienced Master Barbers",
      description: "Hands-on expertise by Sachin Mahaley ensuring precision lines and tailored cuts.",
    },
    {
      icon: <Scissors className="w-5 h-5 text-[#D4AF37]" />,
      title: "Traditional + Modern Styles",
      description: "Mastery of classic gentleman razor shaves as well as contemporary fade & texture trends.",
    },
    {
      icon: <Shield className="w-5 h-5 text-[#D4AF37]" />,
      title: "Clean & Hygienic Environment",
      description: "Strict sterilization of blades, fresh capes, clean towels, and spotless salon stations.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
      title: "Quality Grooming Products",
      description: "Branded creams, premium oils (Coconut & Navratna), and skin-safe color formulations.",
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#D4AF37]" />,
      title: "Warm & Friendly Hospitality",
      description: "Welcoming atmosphere where every client is treated with genuine respect and patience.",
    },
  ];

  return (
    <section className="py-20 bg-[#050505] relative z-10" data-reveal>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <Sparkles className="w-4 h-4" />
            <span>Why Champion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Why Gentlemen Choose Champion Hair Salon
          </h2>
          <p className="text-[#8E8E8E] text-base">
            Craftsmanship, consistency, and genuine client satisfaction in every cut and shave.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-stagger>
          {reasons.map((item, idx) => (
            <Card
              key={idx}
              data-stagger-item
              hoverEffect
              className="bg-[#141414] border-white/5 p-6 flex flex-col items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center group-hover:border-[#D4AF37] transition-colors">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-white group-hover:text-[#D4AF37] transition-colors">
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
