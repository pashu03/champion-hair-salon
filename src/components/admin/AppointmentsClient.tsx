"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Search,
  Filter,
  Download,
  Printer,
  PlusCircle,
  MessageSquare,
  Phone,
  Edit2,
  RefreshCw,
  X,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Input, Textarea } from "../ui/Input";

interface Appointment {
  id: string;
  appointmentNumber: string;
  source: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  staffId?: string | null;
  customerNotes?: string | null;
  adminNotes?: string | null;
  customer: { name: string; phone: string };
  service: { name: string };
  staff?: { name: string } | null;
}

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface StaffOption {
  id: string;
  name: string;
  role: string;
}

interface AppointmentFilters {
  search: string;
  status: string;
  date: string;
  staffId: string;
}

export const AppointmentsClient = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesList, setServicesList] = useState<ServiceOption[]>([]);
  const [staffList, setStaffList] = useState<StaffOption[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("ALL");

  // Selected appointment for details modal
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [editStaffId, setEditStaffId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // New walk-in modal
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
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

  const fetchAppointments = async (
    filters: AppointmentFilters = {
      search,
      status: statusFilter,
      date: dateFilter,
      staffId: staffFilter,
    }
  ) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status !== "ALL") params.set("status", filters.status);
      if (filters.date) params.set("date", filters.date);
      if (filters.staffId !== "ALL") params.set("staffId", filters.staffId);

      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      const json = await res.json();
      setAppointments(json.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadInitialAppointments = async () => {
      try {
        const res = await fetch("/api/admin/appointments");
        const json = await res.json();
        if (isActive) setAppointments(json.appointments || []);
      } catch (error) {
        console.error(error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadInitialAppointments();

    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((d) => {
        if (isActive && d.services) {
          setServicesList(d.services);
          if (d.services[0]) {
            setWalkInForm((prev) => ({ ...prev, serviceId: d.services[0].id }));
          }
        }
      });

    fetch("/api/admin/staff")
      .then((r) => r.json())
      .then((d) => {
        if (isActive && d.staff) setStaffList(d.staff);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

  const openEditModal = (appt: Appointment) => {
    setSelectedAppt(appt);
    setEditStatus(appt.status);
    setEditAdminNotes(appt.adminNotes || "");
    setEditStaffId(appt.staffId || "");
    setIsEditModalOpen(true);
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/appointments/${selectedAppt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editAdminNotes,
          staffId: editStaffId,
        }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

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
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingWalkIn(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "COMPLETED":
        return "info";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "danger";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-7">
      {/* Header with Title and Global Actions */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#E0B83F]">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Operations
            </p>
            <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              Appointments
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#AEB4BD]">
              Search bookings, update their status, and register walk-in customers.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:pl-14 xl:pl-0">
          <a href="/api/admin/appointments/export-csv" download className="flex-1 sm:flex-none">
            <Button
              variant="secondary"
              size="sm"
              className="h-10 w-full rounded-xl bg-[#151A22] px-4 text-[#E7E9EC]"
              leftIcon={<Download className="w-3.5 h-3.5 text-[#D4AF37]" />}
            >
              Export CSV
            </Button>
          </a>

          <Button
            variant="secondary"
            size="sm"
            className="h-10 flex-1 rounded-xl bg-[#151A22] px-4 text-[#E7E9EC] sm:flex-none"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-3.5 h-3.5 text-[#D4AF37]" />}
          >
            Print Sheet
          </Button>

          <Button
            size="sm"
            className="h-10 flex-1 rounded-xl px-4 sm:flex-none"
            onClick={() => setIsWalkInOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Walk-In
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="rounded-2xl border-white/[0.08] bg-[#11161D] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.18)] sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#E7E9EC]">
            <Filter className="h-4 w-4 text-[#D4AF37]" />
            Find appointments
          </div>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-[#747D89] sm:block">
            Live database
          </span>
        </div>
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-12">
          {/* Search Box */}
          <label className="relative sm:col-span-2 xl:col-span-4">
            <span className="sr-only">Search appointments</span>
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#87909C]" />
            <input
              type="text"
              placeholder="Search by customer name, phone, or CH- ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-[#0C1016] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-[#69727E] hover:border-white/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
            />
          </label>

          {/* Status Filter */}
          <label className="xl:col-span-2">
            <span className="sr-only">Filter by status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-[#0C1016] px-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="NO_SHOW">NO SHOW</option>
            </select>
          </label>

          <label className="xl:col-span-2">
            <span className="sr-only">Filter by barber</span>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-[#0C1016] px-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
            >
              <option value="ALL">All Barbers</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </label>

          {/* Date Filter */}
          <label className="xl:col-span-2">
            <span className="sr-only">Filter by appointment date</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-[#0C1016] px-3 text-sm text-white outline-none transition hover:border-white/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10"
            />
          </label>

          {/* Submit Search Button */}
          <div className="flex gap-2 sm:col-span-2 xl:col-span-2">
            <Button type="submit" size="sm" className="h-11 flex-1 rounded-xl px-4 text-xs">
              Filter
            </Button>
            {(search || statusFilter !== "ALL" || dateFilter || staffFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setDateFilter("");
                  setStaffFilter("ALL");
                  void fetchAppointments({
                    search: "",
                    status: "ALL",
                    date: "",
                    staffId: "ALL",
                  });
                }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0C1016] text-[#AEB4BD] transition hover:border-white/20 hover:bg-[#1A2029] hover:text-white"
                title="Reset filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* Appointments Data Table */}
      <Card className="overflow-hidden rounded-2xl border-white/[0.08] bg-[#11161D] p-0 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-4 sm:px-5">
          <div>
            <h3 className="text-sm font-bold text-white">Appointment register</h3>
            <p className="mt-0.5 text-xs text-[#89929E]">
              {isLoading
                ? "Updating records..."
                : `${appointments.length} appointment${appointments.length === 1 ? "" : "s"} found`}
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Synced
          </span>
        </div>
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-[#8E8E8E]">Loading appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <div>
            <div className="divide-y divide-white/[0.07] md:hidden">
              {appointments.map((appt) => (
                <article key={appt.id} className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-bold text-[#E7C75F]">
                        {appt.appointmentNumber}
                      </p>
                      <h4 className="mt-1 text-base font-bold text-white">{appt.customer.name}</h4>
                      <p className="text-xs text-[#98A1AC]">{appt.customer.phone}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(appt.status)} size="sm">
                      {appt.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-white/[0.07] bg-[#0C1016] p-3.5 text-xs">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737D89]">Service</p>
                      <p className="mt-1 font-semibold text-[#E7E9EC]">{appt.service.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737D89]">Barber</p>
                      <p className="mt-1 font-semibold text-[#E7E9EC]">{appt.staff?.name || "Any barber"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737D89]">Date & time</p>
                      <p className="mt-1 font-semibold text-[#E7E9EC]">{appt.date}</p>
                      <p className="text-[#D4AF37]">{appt.startTime} – {appt.endTime}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#737D89]">Amount</p>
                      <p className="mt-1 font-display text-base font-bold text-[#E7C75F]">₹{appt.totalPrice}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(appt)}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 text-xs font-semibold text-[#F0D478]"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Manage
                    </button>
                    <a
                      href={`https://wa.me/91${appt.customer.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${appt.customer.name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </a>
                    <a
                      href={`tel:${appt.customer.phone}`}
                      aria-label={`Call ${appt.customer.name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#CBD0D6]"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#0C1016] text-[10px] uppercase tracking-[0.14em] text-[#89929E]">
                  <th className="px-4 py-4 font-semibold">Reference</th>
                  <th className="px-4 py-4 font-semibold">Customer</th>
                  <th className="px-4 py-4 font-semibold">Service</th>
                  <th className="px-4 py-4 font-semibold">Barber</th>
                  <th className="px-4 py-4 font-semibold">Date & Time</th>
                  <th className="px-4 py-4 font-semibold">Amount</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="group transition-colors hover:bg-white/[0.025]"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-bold text-[#E7C75F]">
                      {appt.appointmentNumber}
                      {appt.source === "WALK_IN" && (
                        <span className="ml-1.5 rounded bg-white/[0.07] px-1.5 py-0.5 text-[9px] text-[#B8BEC6]">
                          Walk-In
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="font-bold text-white">{appt.customer.name}</div>
                      <div className="mt-0.5 text-[11px] text-[#929BA6]">{appt.customer.phone}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="font-medium text-[#E7E9EC]">{appt.service.name}</div>
                      <div className="mt-0.5 text-[11px] text-[#7E8793]">{appt.duration} mins</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[#C7CCD2]">
                      {appt.staff ? appt.staff.name : "Any Master Barber"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="text-white font-medium">{appt.date}</div>
                      <div className="text-[#D4AF37] text-[11px]">
                        {appt.startTime} – {appt.endTime}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-display text-sm font-bold text-[#E7C75F]">
                      ₹{appt.totalPrice}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <Badge variant={getStatusBadgeVariant(appt.status)} size="sm">
                        {appt.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(appt)}
                          className="rounded-lg border border-white/10 bg-[#171C24] p-2 text-[#D7DBE0] transition-colors hover:border-[#D4AF37]/50 hover:bg-[#202630] hover:text-white"
                          title="Edit Appointment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`https://wa.me/91${appt.customer.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] p-2 text-emerald-300 transition-colors hover:border-emerald-400/35 hover:bg-emerald-400/10"
                          title="WhatsApp Customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={`tel:${appt.customer.phone}`}
                          className="rounded-lg border border-white/10 bg-[#171C24] p-2 text-[#BFC5CC] transition-colors hover:bg-[#202630] hover:text-white"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        ) : (
          <div className="py-16 text-center space-y-2 p-6">
            <CalendarDays className="w-8 h-8 text-[#737373] mx-auto" />
            <h4 className="text-base font-bold text-white">No Appointments Found</h4>
            <p className="text-xs text-[#8E8E8E]">Try adjusting your search terms or filters above.</p>
          </div>
        )}
      </Card>

      {/* Edit Appointment Modal */}
      {selectedAppt && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Manage Appointment ${selectedAppt.appointmentNumber}`}
          description={`Customer: ${selectedAppt.customer.name} (${selectedAppt.customer.phone})`}
        >
          <form onSubmit={handleSaveAppointment} className="space-y-4 pt-2">
            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-white/5 text-xs text-[#B5B5B5] space-y-1">
              <p><strong className="text-white">Service:</strong> {selectedAppt.service.name} (₹{selectedAppt.totalPrice})</p>
              <p><strong className="text-white">Date & Time:</strong> {selectedAppt.date} @ {selectedAppt.startTime} – {selectedAppt.endTime}</p>
              {selectedAppt.customerNotes && (
                <p><strong className="text-white">Client Notes:</strong> {selectedAppt.customerNotes}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                Status *
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="NO_SHOW">NO SHOW</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B5B5B5] mb-1.5">
                Assigned Barber
              </label>
              <select
                value={editStaffId}
                onChange={(e) => setEditStaffId(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="">Any Available Barber</option>
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.role})
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Admin Internal Notes (Optional)"
              value={editAdminNotes}
              onChange={(e) => setEditAdminNotes(e.target.value)}
              placeholder="Internal notes, payment status, customer preferences..."
              rows={3}
            />

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Walk-in Modal */}
      <Modal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        title="Create Walk-In Appointment"
        description="Register a walk-in or offline appointment."
      >
        <form onSubmit={handleWalkInSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Customer Name *"
              required
              value={walkInForm.customerName}
              onChange={(e) => setWalkInForm({ ...walkInForm, customerName: e.target.value })}
              placeholder="e.g. Anand Shinde"
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
            placeholder="Special styling notes..."
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
              Save Walk-In
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
