"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Phone, Mail, CheckCircle2, Trash2, Clock, RefreshCw } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export const EnquiriesManagerClient = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries");
      const data = await res.json();
      setEnquiries(data.enquiries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact enquiry?")) return;
    try {
      await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Contact Enquiries</h2>
          <p className="text-xs sm:text-sm text-[#8E8E8E]">
            Customer messages received via the public website contact form.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchEnquiries}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
          <p className="text-xs text-[#8E8E8E]">Loading enquiries...</p>
        </div>
      ) : enquiries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enquiries.map((e) => (
            <Card
              key={e.id}
              className={`bg-[#141414] border p-6 flex flex-col justify-between shadow-xl ${
                e.status === "UNREAD" ? "border-[#D4AF37]/50" : "border-white/10"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{e.name}</h3>
                    {e.status === "UNREAD" && (
                      <Badge variant="gold" size="sm">
                        NEW
                      </Badge>
                    )}
                  </div>

                  <span className="text-[11px] text-[#737373]">
                    {new Date(e.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#8E8E8E]">
                  <span className="flex items-center gap-1.5 text-white font-medium">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> {e.phone}
                  </span>
                  {e.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#8E8E8E]" /> {e.email}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-[#1A1A1A] rounded-lg border border-white/5 text-xs text-[#CCCCCC] leading-relaxed">
                  {e.message}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    value={e.status}
                    onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                    className="bg-[#1C1C1C] border border-white/10 text-xs rounded-lg px-2.5 py-1 text-white outline-none focus:border-[#D4AF37]"
                  >
                    <option value="UNREAD">UNREAD</option>
                    <option value="READ">READ</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/91${e.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                      e.name
                    )}%2C%20thank%20you%20for%20contacting%20Champion%20Hair%20Salon.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-950/40 text-[#25D366] border border-emerald-800/40 hover:bg-emerald-900/40 transition-colors"
                    title="Reply on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <a
                    href={`tel:${e.phone}`}
                    className="p-1.5 rounded-lg bg-[#1C1C1C] text-white border border-white/10 hover:bg-white/10 transition-colors"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400 border border-rose-900/40 hover:bg-rose-900/40"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-[#8E8E8E] bg-[#141414] rounded-2xl border border-white/5 p-6">
          No contact inquiries currently.
        </div>
      )}
    </div>
  );
};
