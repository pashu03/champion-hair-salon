"use client";

import React, { useState, useEffect } from "react";
import { Clock, Save, CheckCircle2, RefreshCw } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export const BusinessHoursClient = () => {
  const [hours, setHours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const fetchHours = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/business-hours");
      const data = await res.json();
      setHours(data.hours || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHours();
  }, []);

  const handleToggleOpen = (index: number) => {
    const updated = [...hours];
    updated[index].isOpen = !updated[index].isOpen;
    setHours(updated);
  };

  const handleTimeChange = (index: number, field: string, value: string) => {
    const updated = [...hours];
    updated[index][field] = value;
    setHours(updated);
  };

  const handleToggleBreak = (index: number) => {
    const updated = [...hours];
    updated[index].hasBreak = !updated[index].hasBreak;
    if (!updated[index].breakStart) updated[index].breakStart = "13:30";
    if (!updated[index].breakEnd) updated[index].breakEnd = "14:30";
    setHours(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(false);

    try {
      const res = await fetch("/api/admin/business-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Business Hours & Availability</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Configure daily opening times, closed days, and afternoon break intervals.
          </p>
        </div>

        {successMessage && (
          <Badge variant="success" size="md">
            <CheckCircle2 className="w-4 h-4" /> Hours Saved Successfully!
          </Badge>
        )}
      </div>

      <Card className="bg-[#141414] border-white/10 p-6 shadow-xl">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-[#8E8E8E]">Loading business hours...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              {hours.map((day, idx) => (
                <div
                  key={day.dayOfWeek}
                  className={`p-4 rounded-xl border transition-all ${
                    day.isOpen
                      ? "bg-[#181818] border-white/10"
                      : "bg-[#121212] border-white/5 opacity-60"
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Day Name & Open Toggle */}
                    <div className="sm:col-span-3 flex items-center justify-between sm:justify-start gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={day.isOpen}
                          onChange={() => handleToggleOpen(idx)}
                          className="w-4 h-4 rounded accent-[#D4AF37]"
                        />
                        <span className="font-bold text-sm text-white">{day.dayName}</span>
                      </label>
                      <Badge variant={day.isOpen ? "success" : "danger"} size="sm">
                        {day.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>

                    {/* Open & Close Times */}
                    {day.isOpen ? (
                      <>
                        <div className="sm:col-span-4 flex items-center gap-2">
                          <div className="flex-1">
                            <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                              Open Time
                            </span>
                            <input
                              type="time"
                              value={day.openTime}
                              onChange={(e) => handleTimeChange(idx, "openTime", e.target.value)}
                              className="w-full bg-[#1F1F1F] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                          <span className="text-[#606060] mt-4">–</span>
                          <div className="flex-1">
                            <span className="text-[10px] uppercase tracking-wider text-[#8E8E8E] block mb-1">
                              Close Time
                            </span>
                            <input
                              type="time"
                              value={day.closeTime}
                              onChange={(e) => handleTimeChange(idx, "closeTime", e.target.value)}
                              className="w-full bg-[#1F1F1F] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>

                        {/* Break Time Toggle & Times */}
                        <div className="sm:col-span-5 flex flex-col sm:flex-row sm:items-center gap-3">
                          <label className="flex items-center gap-2 text-xs text-[#B5B5B5] cursor-pointer whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={day.hasBreak}
                              onChange={() => handleToggleBreak(idx)}
                              className="w-3.5 h-3.5 rounded accent-[#D4AF37]"
                            />
                            <span>Lunch Break</span>
                          </label>

                          {day.hasBreak && (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="time"
                                value={day.breakStart || "13:30"}
                                onChange={(e) => handleTimeChange(idx, "breakStart", e.target.value)}
                                className="bg-[#1F1F1F] border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-[#D4AF37]"
                              />
                              <span className="text-[#606060]">-</span>
                              <input
                                type="time"
                                value={day.breakEnd || "14:30"}
                                onChange={(e) => handleTimeChange(idx, "breakEnd", e.target.value)}
                                className="bg-[#1F1F1F] border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="sm:col-span-9 text-xs text-[#737373] italic">
                        Salon is closed all day. No slots will be bookable online.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button type="submit" size="lg" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                Save Business Hours
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
