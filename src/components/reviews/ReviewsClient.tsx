"use client";

import React, { useState } from "react";
import { Star, MessageSquare, ExternalLink, PlusCircle, CheckCircle2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input, Textarea } from "../ui/Input";

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  serviceName: string | null;
  date: string | null;
}

export const ReviewsClient = ({ reviews }: { reviews: ReviewItem[] }) => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    service: "",
    review: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.review) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          rating: Number(formData.rating),
          serviceName: formData.service || "Hair Grooming",
          review: formData.review,
        }),
      });

      if (res.ok) {
        setSuccessMessage(true);
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSuccessMessage(false);
          setFormData({ name: "", rating: 5, service: "", review: "" });
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Review Summary Banner */}
      <div className="rounded-2xl bg-[#141414] border border-[#D4AF37]/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-2xl bg-[#1C1C1C] border border-[#D4AF37]/40 flex flex-col items-center justify-center text-[#D4AF37] shadow-inner">
            <span className="text-3xl font-extrabold font-display">5.0</span>
            <div className="flex gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-display text-white">
              Exceptional Client Loyalty
            </h3>
            <p className="text-sm text-[#8E8E8E] max-w-md">
              Over 28 years of continuous trust and five-star barber craftsmanship in Maharashtra.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Button
            onClick={() => setIsSubmitModalOpen(true)}
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Write a Review
          </Button>

          <a
            href="https://search.google.com/local/writereview?placeid=championhairsalon"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
              rightIcon={<ExternalLink className="w-4 h-4 text-[#D4AF37]" />}
            >
              Google Review
            </Button>
          </a>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <Card
            key={r.id}
            hoverEffect
            className="bg-[#141414] border-white/5 p-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-[#D4AF37]">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-[#CCCCCC] leading-relaxed italic">
                &ldquo;{r.review}&rdquo;
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white font-display text-sm">{r.customerName}</h4>
                {r.serviceName && (
                  <p className="text-[#8E8E8E] text-[11px]">{r.serviceName}</p>
                )}
              </div>
              {r.date && <span className="text-[#737373] text-[11px]">{r.date}</span>}
            </div>
          </Card>
        ))}
      </div>

      {/* Review Submission Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Share Your Experience"
        description="We value your feedback about Sachin Mahaley & Champion Hair Salon."
      >
        {successMessage ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Thank You for Your Review!</h4>
            <p className="text-sm text-[#8E8E8E]">Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <Input
              label="Your Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Kulkarni"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B5B5B5] mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 text-2xl focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= formData.rating
                          ? "text-[#D4AF37] fill-[#D4AF37]"
                          : "text-white/20"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Service Received (Optional)"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              placeholder="e.g. Hair Cut & Beard Trimming"
            />

            <Textarea
              label="Your Review"
              required
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder="Share details of your visit and how you liked the service..."
              rows={4}
            />

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSubmitModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
