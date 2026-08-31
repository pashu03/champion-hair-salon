"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  PlusCircle,
  Scissors,
  ArrowRight,
  RefreshCw,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Input, Textarea } from "../ui/Input";

export const DashboardClient = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);

  // Walk-in form state
  const [walkInForm, setWalkInForm] = useState({
    customerName: "",
    phone: "",
    serviceId: "",
    staffId: "",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
    notes: "",
  });
  const [isCreatingWalkIn, setIsCreatingWalkIn] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Also fetch services & staff for walk-in modal
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((d) => {
        if (d.services) {
          setServicesList(d.services);
          if (d.services[0]) {
            setWalkInForm((prev) => ({ ...prev, serviceId: d.services[0].id }));
          }
        }
      });

    fetch("/api/admin/staff")
      .then((r) => r.json())
      .then((d) => {
        if (d.staff) setStaffList(d.staff);
      });
  }, []);

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingWalkIn(true);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(walkInForm),
      });

      if (res.ok) {
        setIsWalkInOpen(false);
        setWalkInForm({
          customerName: "",
          phone: "",
          serviceId: servicesList[0]?.id || "",
          staffId: "",
          date: new Date().toISOString().slice(0, 10),
          time: "10:00",
          notes: "",
        });
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingWalkIn(false);
    }
  };

  const handleQuickStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
        <p className="text-sm text-[#8E8E8E]">Loading dashboard metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const todaySchedule = data?.todaySchedule || [];
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="space-y-8">
      {/* Top Header & Walk-In Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Dashboard Overview</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Live operational pulse for Champion Hair Salon.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchDashboardData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsWalkInOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Walk-In Booking
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-[#141414] border-white/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8E8E]">
            <span>Today&apos;s Bookings</span>
            <Clock className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-2xl font-bold font-display text-white">{stats.todayCount || 0}</p>
        </Card>

        <Card className="bg-[#141414] border-white/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8E8E]">
            <span>Upcoming</span>
            <CalendarDays className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-display text-sky-400">{stats.upcomingCount || 0}</p>
        </Card>

        <Card className="bg-[#141414] border-white/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8E8E]">
            <span>Pending Action</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-display text-amber-400">{stats.pendingCount || 0}</p>
        </Card>

        <Card className="bg-[#141414] border-white/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8E8E]">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-display text-emerald-400">{stats.completedCount || 0}</p>
        </Card>

        <Card className="bg-[#141414] border-white/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8E8E]">
            <span>Total Clients</span>
            <Users className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-2xl font-bold font-display text-white">{stats.totalCustomers || 0}</p>
        </Card>

        <Card className="bg-[#141414] border-[#D4AF37]/30 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8E8E8E]">
            <span>Est. Revenue</span>
            <span className="text-[#D4AF37] font-bold">₹</span>
          </div>
          <p className="text-2xl font-bold font-display text-[#D4AF37]">₹{stats.estimatedRevenue || 0}</p>
        </Card>
      </div>

      {/* Main Grid: Today's Schedule & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Schedule Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <span>Today&apos;s Salon Schedule</span>
            </h3>
            <Link href="/admin/appointments" className="text-xs text-[#D4AF37] hover:underline">
              View All
            </Link>
          </div>

          <Card className="bg-[#141414] border-white/10 p-0 overflow-hidden shadow-xl">
            {todaySchedule.length > 0 ? (
              <div className="divide-y divide-white/5">
                {todaySchedule.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-lg bg-[#1E1E1E] border border-white/10 text-center min-w-[64px]">
                        <span className="text-xs font-bold text-[#D4AF37] block">
                          {appt.startTime}
                        </span>
                        <span className="text-[10px] text-[#8E8E8E] block">
                          {appt.duration}m
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{appt.customer.name}</h4>
                          <span className="text-xs font-mono text-[#8E8E8E]">
                            ({appt.appointmentNumber})
                          </span>
                        </div>
                        <p className="text-xs text-[#B5B5B5]">
                          {appt.service.name} • <span className="text-[#D4AF37]">₹{appt.totalPrice}</span>
                        </p>
                        <p className="text-[11px] text-[#737373]">
                          Barber: {appt.staff ? appt.staff.name : "Master Barber"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <select
                        value={appt.status}
                        onChange={(e) => handleQuickStatusChange(appt.id, e.target.value)}
                        className="bg-[#1C1C1C] border border-white/10 text-xs rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#D4AF37]"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="NO_SHOW">NO SHOW</option>
                      </select>

                      <a
                        href={`https://wa.me/91${appt.customer.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#1C1C1C] text-[#25D366] hover:bg-[#25D366]/20 border border-white/10"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-2 p-6">
                <Clock className="w-8 h-8 text-[#737373] mx-auto" />
                <h4 className="text-base font-bold text-white">No Appointments Scheduled Today</h4>
                <p className="text-xs text-[#8E8E8E]">Walk-in clients can be added using the button above.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Recent Bookings Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
              <span>Recent Bookings</span>
            </h3>
          </div>

          <Card className="bg-[#141414] border-white/10 p-0 overflow-hidden shadow-xl">
            {recentBookings.length > 0 ? (
              <div className="divide-y divide-white/5">
                {recentBookings.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{appt.customer.name}</span>
                        <span className="text-[10px] text-[#8E8E8E]">{appt.customer.phone}</span>
                      </div>
                      <p className="text-xs text-[#B5B5B5]">
                        {appt.service.name} • {appt.date} @ {appt.startTime}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#D4AF37] block">₹{appt.totalPrice}</span>
                      <span className="text-[10px] text-[#8E8E8E] uppercase">{appt.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[#8E8E8E] p-6">
                No recent bookings recorded.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Quick Walk-In Modal */}
      <Modal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        title="Create Walk-In Appointment"
        description="Register a walk-in or offline telephone appointment directly."
      >
        <form onSubmit={handleWalkInSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Customer Name *"
              required
              value={walkInForm.customerName}
              onChange={(e) => setWalkInForm({ ...walkInForm, customerName: e.target.value })}
              placeholder="e.g. Ramesh Patil"
            />
            <Input
              label="Mobile Number *"
              required
              value={walkInForm.phone}
              onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
              placeholder="e.g. 9888857057"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                Service *
              </label>
              <select
                required
                value={walkInForm.serviceId}
                onChange={(e) => setWalkInForm({ ...walkInForm, serviceId: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"
              >
                {servicesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (₹{s.price} - {s.duration}m)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                Barber
              </label>
              <select
                value={walkInForm.staffId}
                onChange={(e) => setWalkInForm({ ...walkInForm, staffId: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="">Any Available Barber</option>
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date *"
              type="date"
              required
              value={walkInForm.date}
              onChange={(e) => setWalkInForm({ ...walkInForm, date: e.target.value })}
            />
            <Input
              label="Time (HH:mm) *"
              type="time"
              required
              value={walkInForm.time}
              onChange={(e) => setWalkInForm({ ...walkInForm, time: e.target.value })}
            />
          </div>

          <Textarea
            label="Notes (Optional)"
            value={walkInForm.notes}
            onChange={(e) => setWalkInForm({ ...walkInForm, notes: e.target.value })}
            placeholder="Special styling requests or chair instructions..."
            rows={2}
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsWalkInOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreatingWalkIn}>
              Save Walk-In Appointment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
