"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Scissors,
  User,
  Calendar as CalendarIcon,
  Clock,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Phone,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Input, Textarea } from "../ui/Input";

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string | null;
  isPopular: boolean;
}

export interface StaffItem {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  specialties: string;
}

interface AvailableSlot {
  time: string;
  endTime: string;
  availableBarbers: { id: string; name: string }[];
}

export const BookingWizard = ({
  services,
  staffList,
}: {
  services: ServiceItem[];
  staffList: StaffItem[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("service");

  // Step State (1: Service, 2: Barber, 3: Date & Time, 4: Details)
  const [currentStep, setCurrentStep] = useState(1);

  // Form selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || (services[0]?.id ?? "")
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null); // null = Any Barber
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Customer input details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // Availability state
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotReason, setSlotReason] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Generate next 14 bookable days
  const [datesList, setDatesList] = useState<{ dateStr: string; dayName: string; dayNum: number; monthName: string }[]>([]);

  useEffect(() => {
    const dates = [];
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      dates.push({
        dateStr,
        dayName: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[d.getDay()],
        dayNum: d.getDate(),
        monthName: monthNames[d.getMonth()],
      });
    }

    setDatesList(dates);
    if (!selectedDate && dates[0]) {
      setSelectedDate(dates[0].dateStr);
    }
  }, []);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedStaff = staffList.find((st) => st.id === selectedStaffId);

  // Fetch available slots whenever date, service, or staff changes
  useEffect(() => {
    if (!selectedDate || !selectedService) return;

    let isMounted = true;
    setIsLoadingSlots(true);
    setSlotReason(null);
    setSelectedTime(""); // Reset chosen time on date change

    const params = new URLSearchParams({
      date: selectedDate,
      duration: selectedService.duration.toString(),
    });

    if (selectedStaffId) {
      params.set("staffId", selectedStaffId);
    }

    fetch(`/api/booking/availability?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.isOpen) {
          setAvailableSlots(data.slots || []);
          if (data.slots && data.slots.length === 0) {
            setSlotReason("All slots for this date are currently booked. Please select another date.");
          }
        } else {
          setAvailableSlots([]);
          setSlotReason(data.reason || "Salon is closed on this date.");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load slots:", err);
        setSlotReason("Unable to check live availability. Please check your connection.");
      })
      .finally(() => {
        if (isMounted) setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedServiceId, selectedStaffId]);

  // Service categories for filtering in Step 1
  const categories = [
    "All",
    "Hair Cutting",
    "Shaving & Beard",
    "Hair Colour",
    "Head Massage",
    "Threading",
    "Face Massage & Facials",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  // Handle final submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          staffId: selectedStaffId || undefined,
          date: selectedDate,
          time: selectedTime,
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim() || undefined,
          notes: customerNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Booking failed. Please try again.");
      }

      // Successful redirect to confirmation voucher
      router.push(`/booking/confirmation/${data.appointmentId}`);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while confirming your appointment.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Visual Step Progress Bar */}
      <div className="grid grid-cols-4 gap-2 bg-[#121212] p-2 rounded-xl border border-white/5">
        {[
          { step: 1, label: "1. Service", icon: <Scissors className="w-4 h-4" /> },
          { step: 2, label: "2. Barber", icon: <User className="w-4 h-4" /> },
          { step: 3, label: "3. Time Slot", icon: <Clock className="w-4 h-4" /> },
          { step: 4, label: "4. Your Details", icon: <CalendarIcon className="w-4 h-4" /> },
        ].map((item) => {
          const isDone = currentStep > item.step;
          const isCurrent = currentStep === item.step;

          return (
            <button
              key={item.step}
              onClick={() => {
                if (item.step < currentStep) setCurrentStep(item.step);
              }}
              disabled={item.step > currentStep}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                isCurrent
                  ? "bg-[#D4AF37] text-black shadow-md font-bold"
                  : isDone
                  ? "bg-emerald-950/40 text-emerald-400 cursor-pointer"
                  : "text-[#666666] cursor-not-allowed"
              }`}
            >
              {isDone ? <Check className="w-3.5 h-3.5" /> : item.icon}
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.step}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: Select Service */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-display text-white">Select a Grooming Service</h2>
              <p className="text-sm text-[#8E8E8E]">Choose the service you want to book from our official salon rate card.</p>
            </div>

            {selectedService && (
              <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#D4AF37]/40 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#8E8E8E] uppercase tracking-wider">Selected:</span>
                  <p className="text-sm font-bold text-white">{selectedService.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#D4AF37]">₹{selectedService.price}</span>
                  <p className="text-[11px] text-[#8E8E8E]">{selectedService.duration} mins</p>
                </div>
              </div>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-[#D4AF37] text-black font-bold"
                    : "bg-[#161616] text-[#B5B5B5] hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => {
              const isSelected = selectedServiceId === service.id;

              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#1C1C1C] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]"
                      : "bg-[#141414] border-white/10 hover:border-white/20 hover:bg-[#181818]"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#8E8E8E]">
                        {service.category}
                      </span>
                      {service.isPopular && (
                        <Badge variant="gold" size="sm">
                          Popular
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-base font-bold font-display text-white">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#8E8E8E] line-clamp-2">
                      {service.description || "Tailored master barber grooming service."}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[#8E8E8E]">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{service.duration} mins</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#D4AF37]">₹{service.price}</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                            : "border-white/20"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              size="lg"
              onClick={() => setCurrentStep(2)}
              disabled={!selectedServiceId}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Continue to Barber Selection
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Barber */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-display text-white">Select Your Preferred Barber</h2>
            <p className="text-sm text-[#8E8E8E]">Choose Sachin Mahaley or select any available skilled barber.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Any Available Barber Option */}
            <div
              onClick={() => setSelectedStaffId(null)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                selectedStaffId === null
                  ? "bg-[#1C1C1C] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]"
                  : "bg-[#141414] border-white/10 hover:border-white/20 hover:bg-[#181818]"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-[#222222] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Any Available Barber</h3>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      selectedStaffId === null
                        ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                        : "border-white/20"
                    }`}
                  >
                    {selectedStaffId === null && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-xs text-[#8E8E8E] mt-1">
                  Maximum availability • We will pair you with the best available stylist.
                </p>
              </div>
            </div>

            {/* Individual Barbers */}
            {staffList.map((staff) => {
              const isSelected = selectedStaffId === staff.id;

              return (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaffId(staff.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? "bg-[#1C1C1C] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]"
                      : "bg-[#141414] border-white/10 hover:border-white/20 hover:bg-[#181818]"
                  }`}
                >
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#222222] border border-[#D4AF37]/30 shrink-0">
                    {staff.photo ? (
                      <Image src={staff.photo} alt={staff.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#D4AF37]">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">{staff.name}</h3>
                        <p className="text-xs text-[#D4AF37] font-semibold">{staff.role}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                            : "border-white/20"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-xs text-[#8E8E8E] mt-1 line-clamp-1">{staff.specialties}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              size="lg"
              onClick={() => setCurrentStep(3)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Select Date & Time
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Select Date & Time Slot */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-display text-white">Select Date & Available Time</h2>
            <p className="text-sm text-[#8E8E8E]">
              Booking for <strong className="text-white">{selectedService?.name}</strong> ({selectedService?.duration} mins) with{" "}
              <strong className="text-white">{selectedStaff ? selectedStaff.name : "Any Master Barber"}</strong>.
            </p>
          </div>

          {/* Date Selector Row */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#B5B5B5]">
              Choose Date
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none">
              {datesList.map((d) => {
                const isSelected = selectedDate === d.dateStr;

                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl min-w-[76px] transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#D4AF37] text-black shadow-lg font-bold ring-2 ring-[#F5E296]"
                        : "bg-[#141414] text-[#B5B5B5] hover:text-white hover:bg-[#1E1E1E] border border-white/10"
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wider">{d.dayName}</span>
                    <span className="text-xl font-bold font-display my-0.5">{d.dayNum}</span>
                    <span className="text-[10px]">{d.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B5B5B5]">
                Available Time Slots
              </label>
              <span className="text-xs text-[#8E8E8E]">Salon Hours: 09:00 AM – 09:00 PM</span>
            </div>

            {isLoadingSlots ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 bg-[#141414] rounded-xl border border-white/5">
                <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
                <p className="text-xs text-[#8E8E8E]">Checking live barber chair availability...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-3 px-2 rounded-lg text-sm font-semibold transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? "bg-[#D4AF37] text-black shadow-md font-bold scale-[1.03]"
                          : "bg-[#161616] text-white hover:bg-[#222222] border border-white/10 hover:border-[#D4AF37]/50"
                      }`}
                    >
                      <span>{slot.time}</span>
                      <span className="text-[10px] text-opacity-80 font-normal">
                        to {slot.endTime}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center bg-[#141414] rounded-xl border border-white/5 p-6 space-y-2">
                <AlertCircle className="w-8 h-8 text-[#D4AF37] mx-auto" />
                <p className="text-sm font-medium text-white">{slotReason || "No slots available for this date."}</p>
                <p className="text-xs text-[#8E8E8E]">Please pick another date from the calendar row above.</p>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(2)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              size="lg"
              onClick={() => setCurrentStep(4)}
              disabled={!selectedTime}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Enter Customer Details
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Customer Details & Confirmation */}
      {currentStep === 4 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-display text-white">Your Contact Details</h2>
            <p className="text-sm text-[#8E8E8E]">Please provide your contact information to finalize your booking voucher.</p>
          </div>

          {submitError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Booking Summary Box */}
          <Card className="bg-[#141414] border-[#D4AF37]/30 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Appointment Summary</span>
              </div>
              <span className="text-xs bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded font-semibold border border-[#D4AF37]/30">
                SINCE 1998
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block">Service</span>
                <span className="font-bold text-white">{selectedService?.name}</span>
              </div>
              <div>
                <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block">Barber</span>
                <span className="font-bold text-white">{selectedStaff ? selectedStaff.name : "Any Master Barber"}</span>
              </div>
              <div>
                <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block">Date & Time</span>
                <span className="font-bold text-white">{selectedDate} @ {selectedTime}</span>
              </div>
              <div>
                <span className="text-xs text-[#8E8E8E] uppercase tracking-wider block">Total Amount</span>
                <span className="font-bold text-[#D4AF37] text-base">₹{selectedService?.price}</span>
              </div>
            </div>
          </Card>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
            />
            <Input
              label="Mobile Number (WhatsApp) *"
              required
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 9888857057"
              leftIcon={<Phone className="w-4 h-4" />}
              helperText="We will generate your WhatsApp booking confirmation voucher."
            />
          </div>

          <Input
            label="Email Address (Optional)"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="e.g. rahul@example.com"
          />

          <Textarea
            label="Special Requests / Styling Notes (Optional)"
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="e.g. Skin fade with textured top, low trim on beard..."
            rows={2}
          />

          <div className="pt-2 flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setCurrentStep(3)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<Check className="w-5 h-5" />}
            >
              Confirm Appointment Booking
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
