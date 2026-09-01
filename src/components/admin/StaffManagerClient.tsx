"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Users, PlusCircle, Edit2, Trash2, User, Phone, CheckCircle2, RefreshCw } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Input, Textarea } from "../ui/Input";

export const StaffManagerClient = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: "",
    role: "Master Barber",
    phone: "",
    photo: "",
    bio: "",
    specialties: "Hair Cut, Styling, Shaving, Beard Trimming",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openCreateModal = () => {
    setEditingStaff(null);
    setForm({
      name: "",
      role: "Master Barber",
      phone: "",
      photo: "",
      bio: "",
      specialties: "Hair Cut, Styling, Shaving, Beard Trimming",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: any) => {
    setEditingStaff(s);
    setForm({
      name: s.name,
      role: s.role,
      phone: s.phone || "",
      photo: s.photo || "",
      bio: s.bio || "",
      specialties: s.specialties,
      isActive: s.isActive,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingStaff ? `/api/admin/staff/${editingStaff.id}` : "/api/admin/staff";
      const method = editingStaff ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchStaff();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Staff & Barber Profiles</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Manage master barbers, working status, and individual profiles.
          </p>
        </div>

        <Button size="sm" onClick={openCreateModal} leftIcon={<PlusCircle className="w-4 h-4" />}>
          Add New Barber
        </Button>
      </div>

      {/* Staff Cards Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-xs text-[#8E8E8E]">Loading staff profiles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staff.map((s) => (
            <Card key={s.id} className="bg-[#141414] border-white/10 p-6 flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#1E1E1E] border border-[#D4AF37]/30 shrink-0">
                  {s.photo ? (
                    <Image src={s.photo} alt={s.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#D4AF37]">
                      <User className="w-7 h-7" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white font-display">{s.name}</h3>
                    <Badge variant={s.isActive ? "success" : "danger"} size="sm">
                      {s.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-[#D4AF37]">{s.role}</p>
                  {s.phone && (
                    <p className="text-xs text-[#8E8E8E] flex items-center gap-1.5 pt-0.5">
                      <Phone className="w-3 h-3 text-[#D4AF37]" /> {s.phone}
                    </p>
                  )}
                  <p className="text-xs text-[#B5B5B5] pt-1 line-clamp-2">
                    <strong className="text-white">Specialties:</strong> {s.specialties}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-[#8E8E8E]">
                  Shift: Mon – Sun (9:00 AM – 10:00 PM)
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(s)}
                  leftIcon={<Edit2 className="w-3 h-3" />}
                >
                  Edit Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? `Edit Barber: ${editingStaff.name}` : "Add New Barber"}
        description="Configure barber details, specialties and active booking availability."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Barber Full Name *"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Sachin Mahaley"
            />
            <Input
              label="Role / Title *"
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Founder & Master Barber"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="e.g. +91 8888857057"
            />
            <Input
              label="Photo URL (Optional)"
              value={form.photo}
              onChange={(e) => setForm({ ...form, photo: e.target.value })}
              placeholder="/images/sachin-mahaley.jpg"
            />
          </div>

          <Input
            label="Specialties *"
            required
            value={form.specialties}
            onChange={(e) => setForm({ ...form, specialties: e.target.value })}
            placeholder="e.g. Precision Haircut, Razor Shaving, Beard Sculpting"
          />

          <Textarea
            label="Bio / Experience Description"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Master barber with 28+ years experience..."
            rows={3}
          />

          <label className="flex items-center gap-2 text-xs text-white cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded accent-[#D4AF37]"
            />
            <span>Active & Available for Client Bookings</span>
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
              {editingStaff ? "Update Barber" : "Create Barber"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
