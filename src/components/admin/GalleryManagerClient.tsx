"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, PlusCircle, Trash2, Edit2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";

export const GalleryManagerClient = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "Haircuts",
    imageUrl: "",
    altText: "",
    displayOrder: "0",
    isPublished: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const categories = ["Salon", "Haircuts", "Beard Styles", "Hair Colour", "Before & After"];

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      title: "",
      category: "Haircuts",
      imageUrl: "",
      altText: "",
      displayOrder: "0",
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      altText: item.altText,
      displayOrder: item.displayOrder.toString(),
      isPublished: item.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingItem ? `/api/admin/gallery/${editingItem.id}` : "/api/admin/gallery";
      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchGallery();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublish = async (item: any) => {
    try {
      await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this gallery image?")) return;
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Salon Gallery Management</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Upload or link photos of hairstyles, beard cuts, and salon storefront.
          </p>
        </div>

        <Button size="sm" onClick={openCreateModal} leftIcon={<PlusCircle className="w-4 h-4" />}>
          Add Photo
        </Button>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-xs text-[#8E8E8E]">Loading gallery photos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="bg-[#141414] border-white/10 p-0 overflow-hidden flex flex-col justify-between shadow-xl group">
              <div className="relative aspect-[4/3] w-full bg-[#1A1A1A]">
                <Image src={item.imageUrl} alt={item.altText || item.title} fill className="object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge variant="gold" size="sm">
                    {item.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant={item.isPublished ? "success" : "danger"} size="sm">
                    {item.isPublished ? "Published" : "Hidden"}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white font-display text-sm">{item.title}</h4>
                  <p className="text-xs text-[#8E8E8E] mt-0.5">{item.altText}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => togglePublish(item)}
                    className="text-xs text-[#8E8E8E] hover:text-white flex items-center gap-1.5"
                  >
                    {item.isPublished ? (
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
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] text-white border border-white/10"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
        title={editingItem ? "Edit Photo Details" : "Add Image to Gallery"}
        description="Add high quality salon photographs or hairstyles."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <Input
            label="Image Title *"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Modern Skin Fade with Beard Edge"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Display Order"
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              placeholder="0"
            />
          </div>

          <Input
            label="Image URL or Asset Path *"
            required
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="/images/salon-storefront.jpg or https://..."
          />

          <Input
            label="Alt Text (for SEO & Accessibility)"
            value={form.altText}
            onChange={(e) => setForm({ ...form, altText: e.target.value })}
            placeholder="Descriptive caption for the photo..."
          />

          <label className="flex items-center gap-2 text-xs text-white cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="w-4 h-4 rounded accent-[#D4AF37]"
            />
            <span>Publish photo publicly in the gallery</span>
          </label>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingItem ? "Update Photo" : "Add to Gallery"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
