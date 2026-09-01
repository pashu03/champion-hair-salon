"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, MessageSquare, Phone, MapPin, Mail, Clock } from "lucide-react";
import { Input, Textarea } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSuccess(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Contact Details & Quick Links */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Get In Touch
          </span>
          <h2 className="text-3xl font-bold font-display text-white">
            We&apos;re Here to Serve You
          </h2>
          <p className="text-sm text-[#8E8E8E] leading-relaxed">
            Have questions about styling, treatments, or walk-ins? Call, WhatsApp, or drop a message below.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="space-y-4">
          <Card className="bg-[#141414] border-white/5 p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Phone Calls</h4>
              <p className="text-xs text-[#8E8E8E] mt-0.5">Sachin Mahaley & Salon Desk</p>
              <div className="mt-1.5 flex flex-col space-y-1">
                <a href="tel:+918888857057" className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors">
                  +91 8888857057
                </a>
                <a href="tel:+919158846787" className="text-xs text-[#8E8E8E] hover:text-[#D4AF37] transition-colors">
                  +91 9158846787
                </a>
              </div>
            </div>
          </Card>

          <Card className="bg-[#141414] border-white/5 p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#1C1C1C] border border-emerald-800/40 flex items-center justify-center text-[#25D366] shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">WhatsApp Direct</h4>
              <p className="text-xs text-[#8E8E8E] mt-0.5">Instant chat & quick inquiries</p>
              <a
                href="https://wa.me/918888857057?text=Hi%20Champion%20Hair%20Salon%2C%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-sm font-semibold text-emerald-400 hover:underline"
              >
                Chat on WhatsApp (+91 8888857057)
              </a>
            </div>
          </Card>

          <Card className="bg-[#141414] border-white/5 p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Working Hours</h4>
              <p className="text-sm font-semibold text-white mt-1">Monday – Sunday</p>
              <p className="text-xs text-[#8E8E8E]">9:00 AM – 10:00 PM (Open 7 Days)</p>
            </div>
          </Card>

          <Card className="bg-[#141414] border-white/5 p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Salon Location</h4>
              <p className="text-xs text-[#B5B5B5] mt-1 leading-relaxed">
                Champion Hair Salon, Main Market, Maharashtra, India
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Column: Contact Form */}
      <div className="lg:col-span-7">
        <Card className="bg-[#141414] border-white/10 p-8 sm:p-10 shadow-2xl">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white">Message Sent Successfully!</h3>
              <p className="text-sm text-[#8E8E8E] max-w-md mx-auto">
                Thank you for contacting Champion Hair Salon. Sachin Mahaley and team will respond to your inquiry shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSuccess(false)}
                className="mt-4"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold font-display text-white">Send Us a Message</h3>
                <p className="text-xs text-[#8E8E8E]">Fill out the form below and we will get back to you promptly.</p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anand Shinde"
                />
                <Input
                  label="Mobile Number *"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                />
              </div>

              <Input
                label="Email Address (Optional)"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. anand@example.com"
              />

              <Textarea
                label="Your Message *"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what you'd like to ask about..."
                rows={4}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full justify-center"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
