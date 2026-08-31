"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Search, Phone, Mail, Calendar, Clock, MessageSquare, RefreshCw, Eye } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";

export const CustomersManagerClient = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const url = search ? `/api/admin/customers?search=${encodeURIComponent(search)}` : "/api/admin/customers";
      const res = await fetch(url);
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Customer Directory</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Client directory automatically maintained from online and walk-in bookings.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchCustomers}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="bg-[#141414] border-white/5 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#606060] outline-none focus:border-[#D4AF37]"
            />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
      </Card>

      {/* Customers Table */}
      <Card className="bg-[#141414] border-white/10 p-0 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-[#8E8E8E]">Loading customer records...</p>
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1C1C1C] text-[#8E8E8E] uppercase tracking-wider border-b border-white/10">
                  <th className="py-3.5 px-4 font-semibold">Customer Name</th>
                  <th className="py-3.5 px-4 font-semibold">Mobile Number</th>
                  <th className="py-3.5 px-4 font-semibold">Email</th>
                  <th className="py-3.5 px-4 font-semibold">Total Visits</th>
                  <th className="py-3.5 px-4 font-semibold">Last Visit</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white text-sm">{c.name}</td>
                    <td className="py-3.5 px-4 text-[#CCCCCC]">{c.phone}</td>
                    <td className="py-3.5 px-4 text-[#8E8E8E]">{c.email || "—"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] font-bold">
                        {c.totalVisits} {c.totalVisits === 1 ? "visit" : "visits"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A0A0A0]">
                      {c.lastVisit
                        ? new Date(c.lastVisit).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] text-white border border-white/10"
                          title="View History"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </button>
                        <a
                          href={`https://wa.me/91${c.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-950/40 text-[#25D366] border border-emerald-800/40"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${c.phone}`}
                          className="p-1.5 rounded-lg bg-[#1C1C1C] text-white border border-white/10"
                          title="Call"
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
          <div className="py-16 text-center text-xs text-[#8E8E8E] p-6">
            No customer records found.
          </div>
        )}
      </Card>

      {/* Customer History Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer History: ${selectedCustomer.name}`}
          description={`Phone: ${selectedCustomer.phone} • Total Visits: ${selectedCustomer.totalVisits}`}
          maxWidth="lg"
        >
          <div className="space-y-4 pt-2">
            <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
              Appointment History
            </h4>

            {selectedCustomer.appointments && selectedCustomer.appointments.length > 0 ? (
              <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-[#181818] max-h-80 overflow-y-auto">
                {selectedCustomer.appointments.map((a: any) => (
                  <div key={a.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{a.service.name} (₹{a.totalPrice})</div>
                      <div className="text-[#8E8E8E] mt-0.5">
                        {a.date} @ {a.startTime} – {a.endTime} • Barber: {a.staff?.name || "Any Barber"}
                      </div>
                    </div>
                    <Badge variant={a.status === "CONFIRMED" ? "success" : "neutral"} size="sm">
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8E8E8E]">No previous appointments recorded.</p>
            )}

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
