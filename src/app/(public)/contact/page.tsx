import React from "react";
import { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPin, Phone, MessageSquare, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact & Location",
  description:
    "Get in touch with Champion Hair Salon. Call +91 8888857057 / +91 9158846787, chat on WhatsApp, or visit our salon in Maharashtra.",
};

export default async function ContactPage() {
  const settings = await prisma.businessSettings.findFirst();

  return (
    <div className="pt-28 pb-24 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <MapPin className="w-4 h-4" />
            <span>Connect with Us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            Contact & Directions
          </h1>
          <p className="text-base sm:text-lg text-[#B5B5B5] leading-relaxed">
            Visit Champion Hair Salon or reach out to Sachin Mahaley directly. We are open 7 days a week from 9:00 AM to 9:00 PM.
          </p>
        </div>

        {/* Contact Layout */}
        <ContactForm />

        {/* Google Map Section */}
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#141414]">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold font-display text-white">Salon Location Map</h3>
              <p className="text-xs text-[#8E8E8E] mt-0.5">
                {settings?.address || "Champion Hair Salon, Main Market, Maharashtra, India"}
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Champion+Hair+Salon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
            >
              Open in Google Maps App →
            </a>
          </div>
          <div className="relative aspect-[21/9] min-h-[300px] w-full bg-[#1A1A1A]">
            <iframe
              src={
                settings?.googleMapsEmbedUrl ||
                "https://maps.google.com/maps?q=Champion+Hair+Salon&t=&z=13&ie=UTF8&iwloc=&output=embed"
              }
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Champion Hair Salon Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
