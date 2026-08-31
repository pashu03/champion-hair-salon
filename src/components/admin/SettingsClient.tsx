"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, RefreshCw } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";

export const SettingsClient = () => {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
        <p className="text-xs text-[#8E8E8E]">Loading business settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Business Settings</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Salon contact details, location URLs, and online booking policies.
          </p>
        </div>

        {successMessage && (
          <Badge variant="success" size="md">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved!
          </Badge>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Salon Identity */}
        <Card className="bg-[#141414] border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] font-sans border-b border-white/5 pb-2">
            Salon Identity & Brand
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Salon Name *"
              required
              value={settings.salonName || ""}
              onChange={(e) => handleChange("salonName", e.target.value)}
            />
            <Input
              label="Founder / Owner Name *"
              required
              value={settings.ownerName || ""}
              onChange={(e) => handleChange("ownerName", e.target.value)}
            />
          </div>

          <Input
            label="Tagline *"
            required
            value={settings.tagline || ""}
            onChange={(e) => handleChange("tagline", e.target.value)}
          />
        </Card>

        {/* Contact & Location */}
        <Card className="bg-[#141414] border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] font-sans border-b border-white/5 pb-2">
            Contact & Address Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Primary Phone *"
              required
              value={settings.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <Input
              label="Alternate Phone"
              value={settings.altPhone || ""}
              onChange={(e) => handleChange("altPhone", e.target.value)}
            />
            <Input
              label="WhatsApp Number (Digits only) *"
              required
              value={settings.whatsappNumber || ""}
              onChange={(e) => handleChange("whatsappNumber", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address *"
              type="email"
              required
              value={settings.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              label="City / Region *"
              required
              value={settings.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>

          <Input
            label="Full Physical Address *"
            required
            value={settings.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <Input
            label="Google Maps Embed URL"
            value={settings.googleMapsEmbedUrl || ""}
            onChange={(e) => handleChange("googleMapsEmbedUrl", e.target.value)}
          />

          <Input
            label="Google Review URL"
            value={settings.googleReviewUrl || ""}
            onChange={(e) => handleChange("googleReviewUrl", e.target.value)}
          />
        </Card>

        {/* Booking Rules */}
        <Card className="bg-[#141414] border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] font-sans border-b border-white/5 pb-2">
            Online Booking Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Slot Interval (Mins) *"
              type="number"
              required
              min="10"
              max="120"
              value={settings.slotInterval?.toString() || "30"}
              onChange={(e) => handleChange("slotInterval", parseInt(e.target.value, 10))}
              helperText="Step size for available chair slots (e.g. 30 mins)"
            />

            <Input
              label="Min. Advance Notice (Hours) *"
              type="number"
              required
              min="0"
              max="48"
              value={settings.advanceNoticeHours?.toString() || "1"}
              onChange={(e) => handleChange("advanceNoticeHours", parseInt(e.target.value, 10))}
              helperText="Lead time needed before booking today"
            />

            <Input
              label="Max Advance Booking (Days) *"
              type="number"
              required
              min="1"
              max="180"
              value={settings.maxAdvanceDays?.toString() || "30"}
              onChange={(e) => handleChange("maxAdvanceDays", parseInt(e.target.value, 10))}
              helperText="How far ahead customers can reserve"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
