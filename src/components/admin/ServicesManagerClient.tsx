"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Clock,
  RefreshCw,
  Search,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Input, Textarea } from "../ui/Input";

export const ServicesManagerClient = () => {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [form, setForm] = useState({
    name: "",
    category: "Hair Cutting",
    price: "120",
    duration: "30",
    description: "",
    isPopular: false,
    isActive: true,
    displayOrder: "0",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const categories = [
    "Hair Cutting",
    "Shaving & Beard",
    "Hair Colour",
    "Head Massage",
    "Threading",
    "Face Massage & Facials",
    "Packages",
    "Other",
  ];

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      name: "",
      category: "Hair Cutting",
      price: "120",
      duration: "30",
      description: "",
      isPopular: false,
      isActive: true,
      displayOrder: "0",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: any) => {
    setEditingService(service);
    setForm({
      name: service.name,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration.toString(),
      description: service.description || "",
      isPopular: service.isPopular,
      isActive: service.isActive,
      displayOrder: service.displayOrder.toString(),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError("");

    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";
      const method = editingService ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price, 10),
          duration: parseInt(form.duration, 10),
          displayOrder: parseInt(form.displayOrder || "0", 10),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save service");
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove or deactivate "${name}"?`)) {
      return;
    }

    try {
      await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Services & Rate Menu</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Add, update rates, and manage service duration for online booking.
          </p>
        </div>

        <Button size="sm" onClick={openCreateModal} leftIcon={<PlusCircle className="w-4 h-4" />}>
          Add New Service
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="bg-[#141414] border-white/5 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#606060] outline-none focus:border-[#D4AF37]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Card>

      {/* Services Table */}
      <Card className="bg-[#141414] border-white/10 p-0 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-[#8E8E8E]">Loading services...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1C1C1C] text-[#8E8E8E] uppercase tracking-wider border-b border-white/10">
                  <th className="py-3.5 px-4 font-semibold">Service Name</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price (INR)</th>
                  <th className="py-3.5 px-4 font-semibold">Duration</th>
                  <th className="py-3.5 px-4 font-semibold">Popular</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{s.name}</div>
                      {s.description && (
                        <div className="text-[#8E8E8E] text-[11px] line-clamp-1 max-w-sm">
                          {s.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#CCCCCC] whitespace-nowrap">
                      {s.category}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#D4AF37] font-display text-sm whitespace-nowrap">
                      ₹{s.price}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-white">
                      {s.duration} mins
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {s.isPopular ? (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-[#606060]">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {s.isActive ? (
                        <Badge variant="success" size="sm">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          Inactive
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] text-white border border-white/10"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border border-rose-900/40"
                          title="Delete / Deactivate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#8E8E8E] p-6">
            No services found.
          </div>
        )}
      </Card>

      {/* Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? `Edit Service: ${editingService.name}` : "Add New Grooming Service"}
        description="Configure pricing, duration and visibility on the public rate card."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Service Name *"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Skin Fade Haircut"
            />

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price (INR ₹) *"
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="120"
            />

            <Input
              label="Duration (Minutes) *"
              type="number"
              required
              min="5"
              step="5"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="30"
            />
          </div>

          <Textarea
            label="Description (Optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief explanation of the service and techniques..."
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                className="w-4 h-4 rounded accent-[#D4AF37]"
              />
              <span>Mark as Popular Service</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded accent-[#D4AF37]"
              />
              <span>Service is Active (Bookable)</span>
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingService ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
