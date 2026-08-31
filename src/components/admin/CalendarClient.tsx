"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export const CalendarClient = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDayStr, setSelectedDayStr] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDayStr(today.toISOString().slice(0, 10));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Fetch appointments for this month
  useEffect(() => {
    const startStr = `${year}-${(month + 1).toString().padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${lastDay.toString().padStart(2, "0")}`;

    setIsLoading(true);
    fetch(`/api/admin/calendar?startDate=${startStr}&endDate=${endStr}`)
      .then((r) => r.json())
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [year, month]);

  // Build calendar matrix
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Leading empty cells
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Days of month
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
    calendarDays.push({
      dayNum: d,
      dateStr,
      appts: appointments.filter((a) => a.date === dateStr),
    });
  }

  const selectedDayAppointments = appointments.filter(
    (a) => a.date === selectedDayStr
  );

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Appointment Calendar</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Visual schedule and booking overview by day.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="flex items-center gap-1 bg-[#141414] border border-white/10 rounded-lg p-1">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-white/10 rounded text-white"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold uppercase tracking-wider text-white">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-white/10 rounded text-white"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Grid */}
        <div className="lg:col-span-8">
          <Card className="bg-[#141414] border-white/10 p-4 sm:p-6 shadow-xl">
            {/* Day of week headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#8E8E8E] uppercase pb-3 border-b border-white/10">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 pt-3">
              {calendarDays.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="h-20 bg-transparent" />;
                }

                const isSelected = cell.dateStr === selectedDayStr;
                const isToday = cell.dateStr === new Date().toISOString().slice(0, 10);

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => setSelectedDayStr(cell.dateStr)}
                    className={`h-20 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#1F1F1F] border-[#D4AF37] ring-1 ring-[#D4AF37]"
                        : isToday
                        ? "bg-[#1A1A1A] border-[#D4AF37]/40"
                        : "bg-[#161616] border-white/5 hover:border-white/20 hover:bg-[#1A1A1A]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isToday
                            ? "text-[#D4AF37]"
                            : isSelected
                            ? "text-white"
                            : "text-[#B5B5B5]"
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {cell.appts.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                          {cell.appts.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      {cell.appts.slice(0, 2).map((a) => (
                        <div
                          key={a.id}
                          className="text-[9px] truncate px-1 py-0.5 rounded bg-white/5 text-[#E0E0E0]"
                        >
                          {a.startTime} {a.customer.name}
                        </div>
                      ))}
                      {cell.appts.length > 2 && (
                        <div className="text-[8px] text-[#8E8E8E] text-right">
                          +{cell.appts.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right: Selected Day's Appointments Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
              <span>Schedule for {selectedDayStr}</span>
            </h3>
            <span className="text-xs text-[#D4AF37] font-bold">
              {selectedDayAppointments.length} Bookings
            </span>
          </div>

          <Card className="bg-[#141414] border-white/10 p-0 overflow-hidden shadow-xl max-h-[600px] overflow-y-auto">
            {selectedDayAppointments.length > 0 ? (
              <div className="divide-y divide-white/5">
                {selectedDayAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 space-y-2 hover:bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#D4AF37]">
                        {appt.startTime} – {appt.endTime}
                      </span>
                      <span className="text-[10px] font-mono text-[#8E8E8E]">
                        {appt.appointmentNumber}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{appt.customer.name}</h4>
                      <p className="text-xs text-[#B5B5B5]">
                        {appt.service.name} (₹{appt.totalPrice})
                      </p>
                      <p className="text-[11px] text-[#737373]">
                        Barber: {appt.staff ? appt.staff.name : "Any Master Barber"}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs">
                      <Badge
                        variant={
                          appt.status === "CONFIRMED"
                            ? "success"
                            : appt.status === "COMPLETED"
                            ? "info"
                            : appt.status === "CANCELLED"
                            ? "danger"
                            : "warning"
                        }
                        size="sm"
                      >
                        {appt.status}
                      </Badge>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/91${appt.customer.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-[#25D366] hover:bg-white/5 rounded"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${appt.customer.phone}`}
                          className="p-1 text-[#B5B5B5] hover:text-white rounded"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-2 p-6">
                <Clock className="w-8 h-8 text-[#737373] mx-auto" />
                <h4 className="text-sm font-bold text-white">No Bookings on this Date</h4>
                <p className="text-xs text-[#8E8E8E]">Chair is open for walk-ins.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
