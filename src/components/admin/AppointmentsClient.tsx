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
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Input, Textarea } from "../ui/Input";

export const AppointmentsClient = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("ALL");

  // Selected appointment for details modal
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
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

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (dateFilter) params.set("date", dateFilter);
      if (staffFilter !== "ALL") params.set("staffId", staffFilter);

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
    fetchAppointments();

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
  }, [statusFilter, dateFilter, staffFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

  const openEditModal = (appt: any) => {
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
    <div className="space-y-6">
      {/* Header with Title and Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Appointments Management</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Filter, search, update status, and manage salon appointments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a href="/api/admin/appointments/export-csv" download>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5 text-[#D4AF37]" />}
            >
              Export CSV
            </Button>
          </a>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-3.5 h-3.5 text-[#D4AF37]" />}
          >
            Print Sheet
          </Button>

          <Button
            size="sm"
            onClick={() => setIsWalkInOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Walk-In
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-[#141414] border-white/5 p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone, or CH- ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#606060] outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="NO_SHOW">NO SHOW</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="sm:col-span-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Submit Search Button */}
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" size="sm" className="flex-1 text-xs py-2">
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
                  setTimeout(fetchAppointments, 50);
                }}
                className="p-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#8E8E8E] hover:text-white rounded-lg border border-white/10 text-xs"
                title="Reset filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* Appointments Data Table */}
      <Card className="bg-[#141414] border-white/10 p-0 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-[#8E8E8E]">Loading appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1C1C1C] text-[#8E8E8E] uppercase tracking-wider border-b border-white/10">
                  <th className="py-3.5 px-4 font-semibold">Reference</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Service</th>
                  <th className="py-3.5 px-4 font-semibold">Barber</th>
                  <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {appt.appointmentNumber}
                      {appt.source === "WALK_IN" && (
                        <span className="ml-1.5 text-[9px] bg-white/10 text-[#B5B5B5] px-1 py-0.2 rounded">
                          Walk-In
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-white">{appt.customer.name}</div>
                      <div className="text-[#8E8E8E] text-[11px]">{appt.customer.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-white font-medium">{appt.service.name}</div>
                      <div className="text-[#737373] text-[11px]">{appt.duration} mins</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#CCCCCC] whitespace-nowrap">
                      {appt.staff ? appt.staff.name : "Any Master Barber"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-white font-medium">{appt.date}</div>
                      <div className="text-[#D4AF37] text-[11px]">
                        {appt.startTime} – {appt.endTime}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#D4AF37] font-display text-sm whitespace-nowrap">
                      ₹{appt.totalPrice}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(appt.status)} size="sm">
                        {appt.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(appt)}
                          className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] text-white border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
                          title="Edit Appointment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`https://wa.me/91${appt.customer.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-emerald-950/40 text-[#25D366] border border-white/10 hover:border-[#25D366]/40 transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={`tel:${appt.customer.phone}`}
                          className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-white/10 text-[#B5B5B5] hover:text-white border border-white/10 transition-colors"
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
