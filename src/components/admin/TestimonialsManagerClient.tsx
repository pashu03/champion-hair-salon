"use client";

import React, { useState, useEffect } from "react";
import { Star, PlusCircle, Trash2, Edit2, CheckCircle2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Input, Textarea } from "../ui/Input";

export const TestimonialsManagerClient = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    rating: "5",
    serviceName: "Hair Cut & Styling",
    review: "",
    isPublished: true,
    isFeatured: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      customerName: "",
      rating: "5",
      serviceName: "Hair Cut & Styling",
      review: "",
      isPublished: true,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingItem(t);
    setForm({
      customerName: t.customerName,
      rating: t.rating.toString(),
      serviceName: t.serviceName || "",
      review: t.review,
      isPublished: t.isPublished,
      isFeatured: t.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingItem
        ? `/api/admin/testimonials/${editingItem.id}`
        : "/api/admin/testimonials";
      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rating: parseInt(form.rating, 10),
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublish = async (t: any) => {
    try {
      await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !t.isPublished }),
      });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Testimonials & Reviews</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Moderate customer feedback and feature verified reviews on the home page.
          </p>
        </div>

        <Button size="sm" onClick={openCreateModal} leftIcon={<PlusCircle className="w-4 h-4" />}>
          Add Review
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-xs text-[#8E8E8E]">Loading testimonials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.id} className="bg-[#141414] border-white/10 p-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <Badge variant={t.isPublished ? "success" : "danger"} size="sm">
                    {t.isPublished ? "Published" : "Hidden"}
                  </Badge>
                </div>

                <p className="text-xs text-[#CCCCCC] leading-relaxed italic">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{t.customerName}</h4>
                    {t.serviceName && (
                      <p className="text-[#8E8E8E] text-[11px]">{t.serviceName}</p>
                    )}
                  </div>
                  {t.isFeatured && (
                    <Badge variant="gold" size="sm">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => togglePublish(t)}
                    className="text-xs text-[#8E8E8E] hover:text-white flex items-center gap-1.5"
                  >
                    {t.isPublished ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> <span>Publish</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] text-white border border-white/10"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border border-rose-900/40"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Review" : "Add Testimonial"}
        description="Add genuine customer feedback."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <Input
            label="Customer Name *"
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            placeholder="e.g. Sunil Kadam"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                Rating (Stars) *
              </label>
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>

            <Input
              label="Service Received"
              value={form.serviceName}
              onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
              placeholder="e.g. Hair Cut & Beard Shape"
            />
          </div>

          <Textarea
            label="Review Text *"
            required
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            placeholder="What the client said about the service..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4 rounded accent-[#D4AF37]"
              />
              <span>Published Publicly</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded accent-[#D4AF37]"
              />
              <span>Feature on Home Page</span>
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingItem ? "Update Testimonial" : "Add Testimonial"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
