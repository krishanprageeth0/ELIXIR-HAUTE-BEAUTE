"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";
import {
  Check,
  Calendar as CalendarIcon,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { formatTimeDisplay } from "@/lib/booking-utils";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  price: number;
  image: string;
  category: { name: string; slug: string };
}

interface StaffSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
  breakStart?: string | null;
  breakEnd?: string | null;
}

interface Staff {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  experienceYears: number;
  rating: number;
  specializations: string;
  schedules: StaffSchedule[];
}

interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
  availableStaffIds?: string[];
}

export default function BookingWizard({
  initialServices,
  initialStaff,
}: {
  initialServices: Service[];
  initialStaff: Staff[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Wizard state (Step 1 to 7)
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("any");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Customer Details Form
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Availability state
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Initialize from search parameters (e.g. ?service=id, ?stylist=id)
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const stylistParam = searchParams.get("stylist");

    if (serviceParam && initialServices.some((s) => s.id === serviceParam || s.slug === serviceParam)) {
      const match = initialServices.find((s) => s.id === serviceParam || s.slug === serviceParam);
      if (match) setSelectedServiceIds([match.id]);
    }

    if (stylistParam && initialStaff.some((st) => st.id === stylistParam)) {
      setSelectedStaffId(stylistParam);
    }
  }, [searchParams, initialServices, initialStaff]);

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user, customerName, customerEmail, customerPhone]);

  // Calculations
  const selectedServices = useMemo(() => {
    return initialServices.filter((s) => selectedServiceIds.includes(s.id));
  }, [initialServices, selectedServiceIds]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [selectedServices]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((acc, s) => acc + s.price, 0);
  }, [selectedServices]);

  const selectedStaff = useMemo(() => {
    if (selectedStaffId === "any") return null;
    return initialStaff.find((s) => s.id === selectedStaffId) || null;
  }, [initialStaff, selectedStaffId]);

  // Fetch available slots whenever date, staffId, or duration changes
  const fetchAvailability = useCallback(async () => {
    if (!selectedDate || totalDuration === 0) return;
    setLoadingSlots(true);
    setBookingError(null);

    try {
      const res = await fetch(
        `/api/availability?date=${selectedDate}&staffId=${selectedStaffId}&duration=${totalDuration}`
      );
      const data = await res.json();
      if (res.ok && data.slots) {
        setAvailableSlots(data.slots);
      } else {
        setAvailableSlots([]);
        if (data.message) setBookingError(data.message);
      }
    } catch {
      setAvailableSlots([]);
      setBookingError("Failed to check real-time schedule. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate, selectedStaffId, totalDuration]);

  useEffect(() => {
    if (selectedDate && currentStep >= 3) {
      fetchAvailability();
    }
  }, [selectedDate, selectedStaffId, totalDuration, currentStep, fetchAvailability]);

  // Toggle service selection in Step 1
  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calendar helpers
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Empty padding for days before day 1
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    // Days in current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [currentMonth]);

  const isDateDisabled = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(d);
    checkDate.setHours(0, 0, 0, 0);

    // Disable past dates
    if (checkDate < today) return true;

    // If specific stylist selected, check if stylist works on this day of week
    if (selectedStaff) {
      const dayOfWeek = d.getDay();
      const sched = selectedStaff.schedules.find((s) => s.dayOfWeek === dayOfWeek);
      if (!sched || !sched.isWorking) return true;
    }

    return false;
  };

  const handleDateSelect = (d: Date) => {
    if (isDateDisabled(d)) return;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setSelectedDate(`${year}-${month}-${day}`);
    setSelectedTime(""); // Reset time on date change
  };

  // Submit appointment to server
  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setBookingError(null);

    try {
      const payload = {
        serviceIds: selectedServiceIds,
        staffId: selectedStaffId === "any" ? undefined : selectedStaffId,
        date: selectedDate,
        startTime: selectedTime,
        customerName,
        customerEmail,
        customerPhone,
        notes,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Booking failed. Please try another time slot.");
      }

      setConfirmedBooking(data.appointment);
      setCurrentStep(7);

      // Trigger luxury confetti celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#C8A46A", "#E8DDCE", "#F8F6F2", "#D8B57B"],
        });
      } catch {}
    } catch (err: any) {
      setBookingError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step names
  const stepTitles = [
    "Select Services",
    "Select Stylist",
    "Choose Date",
    "Select Time",
    "Your Details",
    "Review Summary",
    "Confirmation",
  ];

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Wizard Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3 overflow-x-auto no-scrollbar pb-2">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={title}
                className={`flex items-center gap-2 whitespace-nowrap px-2 ${
                  isCurrent
                    ? "text-[#C8A46A] font-semibold"
                    : isCompleted
                    ? "text-[#E8DDCE]"
                    : "text-[#929292]"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                    isCurrent
                      ? "border-[#C8A46A] bg-[#C8A46A] text-black"
                      : isCompleted
                      ? "border-[#C8A46A] text-[#C8A46A]"
                      : "border-white/10 bg-[#161616] text-[#929292]"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <span className="text-xs uppercase tracking-wider hidden md:inline">
                  {title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="h-1 w-full bg-[#1B1B1B] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C8A46A] to-[#D8B57B] transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Booking Summary Floating Header on Steps 2-6 */}
      {currentStep > 1 && currentStep < 7 && selectedServices.length > 0 && (
        <div className="mb-8 p-4 bg-[#161616] border border-[#C8A46A]/20 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[#929292] uppercase tracking-wider block text-[10px]">
                Selected Services
              </span>
              <span className="text-[#F8F6F2] font-medium">
                {selectedServices.map((s) => s.name).join(", ")}
              </span>
            </div>
            <div>
              <span className="text-[#929292] uppercase tracking-wider block text-[10px]">
                Total Duration
              </span>
              <span className="text-[#E8DDCE] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C8A46A]" />
                {totalDuration} Minutes
              </span>
            </div>
            <div>
              <span className="text-[#929292] uppercase tracking-wider block text-[10px]">
                Investment
              </span>
              <span className="text-[#C8A46A] font-serif text-base font-bold">
                ${totalPrice}
              </span>
            </div>
          </div>

          {selectedDate && (
            <div className="text-right">
              <span className="text-[#929292] uppercase tracking-wider block text-[10px]">
                Target Slot
              </span>
              <span className="text-[#E8DDCE]">
                {selectedDate} {selectedTime ? `@ ${formatTimeDisplay(selectedTime)}` : ""}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error Alert Display */}
      {bookingError && (
        <div className="mb-8 p-4 bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{bookingError}</span>
        </div>
      )}

      {/* ================= STEP 1: SELECT SERVICES ================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2] uppercase font-light">
                Step 1: Choose Your Rituals
              </h2>
              <p className="text-xs text-[#929292] mt-1">
                You can select one or multiple bespoke services for a complete atelier experience.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#C8A46A]">
                {selectedServiceIds.length} Selected
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialServices.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-5 cursor-pointer transition-all duration-300 border flex gap-4 ${
                    isSelected
                      ? "bg-[#1C1A16] border-[#C8A46A] shadow-lg shadow-[#C8A46A]/10"
                      : "bg-[#161616] border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="relative w-24 h-28 shrink-0 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base text-[#F8F6F2] font-normal leading-snug">
                          {service.name}
                        </h3>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#C8A46A] border-[#C8A46A] text-black"
                              : "border-white/20"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#929292] line-clamp-2 mt-1 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                      <span className="text-xs text-[#E8DDCE] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C8A46A]" />
                        {service.durationMinutes} min
                      </span>
                      <span className="font-serif text-lg text-[#C8A46A]">
                        ${service.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex justify-end">
            <button
              onClick={() => {
                if (selectedServiceIds.length === 0) {
                  setBookingError("Please select at least one service to proceed.");
                  return;
                }
                setBookingError(null);
                setCurrentStep(2);
              }}
              disabled={selectedServiceIds.length === 0}
              className="px-8 py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              <span>Continue to Stylist Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: SELECT STYLIST ================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2] uppercase font-light">
              Step 2: Select Your Artisan
            </h2>
            <p className="text-xs text-[#929292] mt-1">
              Choose your dedicated master stylist or select &ldquo;Any Available Stylist&rdquo; for maximum schedule flexibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Any Available Option */}
            <div
              onClick={() => setSelectedStaffId("any")}
              className={`p-6 cursor-pointer border transition-all flex flex-col justify-between ${
                selectedStaffId === "any"
                  ? "bg-[#1C1A16] border-[#C8A46A] shadow-lg shadow-[#C8A46A]/10"
                  : "bg-[#161616] border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full border border-[#C8A46A]/50 bg-[#C8A46A]/10 flex items-center justify-center text-[#C8A46A]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedStaffId === "any"
                      ? "bg-[#C8A46A] border-[#C8A46A] text-black"
                      : "border-white/20"
                  }`}
                >
                  {selectedStaffId === "any" && <Check className="w-3 h-3" />}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg text-[#F8F6F2] mb-1">
                  Any Available Master Artisan
                </h3>
                <p className="text-xs text-[#929292] leading-relaxed">
                  We will pair you with the best available senior specialist matching your chosen rituals and preferred time.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-[#C8A46A]">
                Fastest Availability & Maximum Slots
              </div>
            </div>

            {/* Individual Stylists */}
            {initialStaff.map((staff) => {
              const isSelected = selectedStaffId === staff.id;
              return (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaffId(staff.id)}
                  className={`p-6 cursor-pointer border transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#1C1A16] border-[#C8A46A] shadow-lg shadow-[#C8A46A]/10"
                      : "bg-[#161616] border-white/5 hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#C8A46A]/30">
                        <Image
                          src={staff.photo}
                          alt={staff.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#C8A46A] border-[#C8A46A] text-black"
                            : "border-white/20"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    <h3 className="font-serif text-lg text-[#F8F6F2] mb-0.5">
                      {staff.name}
                    </h3>
                    <p className="text-[11px] text-[#C8A46A] uppercase tracking-wider mb-2">
                      {staff.title}
                    </p>
                    <p className="text-xs text-[#929292] line-clamp-2 leading-relaxed mb-3">
                      {staff.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 text-[11px] text-[#E8DDCE]/70">
                    ★ {staff.rating.toFixed(2)} · {staff.experienceYears} Years Mastery
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 border border-white/10 text-xs uppercase tracking-wider text-[#929292] hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-8 py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] transition-colors flex items-center gap-2"
            >
              <span>Continue to Date Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: SELECT DATE ================= */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2] uppercase font-light">
              Step 3: Choose Appointment Date
            </h2>
            <p className="text-xs text-[#929292] mt-1">
              Select an available working day from our luxury booking calendar.
            </p>
          </div>

          <div className="bg-[#161616] border border-white/5 p-6 sm:p-8 max-w-2xl mx-auto">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <h3 className="font-serif text-xl text-[#F8F6F2] uppercase">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const prev = new Date(currentMonth);
                    prev.setMonth(prev.getMonth() - 1);
                    setCurrentMonth(prev);
                  }}
                  className="p-2 border border-white/10 hover:border-[#C8A46A] text-[#929292] hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const next = new Date(currentMonth);
                    next.setMonth(next.getMonth() + 1);
                    setCurrentMonth(next);
                  }}
                  className="p-2 border border-white/10 hover:border-[#C8A46A] text-[#929292] hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of week labels */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs tracking-wider uppercase text-[#929292] mb-4">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((d, index) => {
                if (!d) {
                  return <div key={`empty-${index}`} className="h-12" />;
                }

                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                const dateKey = `${year}-${month}-${day}`;
                const isSelected = selectedDate === dateKey;
                const disabled = isDateDisabled(d);

                return (
                  <button
                    key={dateKey}
                    disabled={disabled}
                    onClick={() => handleDateSelect(d)}
                    className={`h-12 text-xs font-medium transition-all flex flex-col items-center justify-center border ${
                      isSelected
                        ? "bg-[#C8A46A] border-[#C8A46A] text-black font-bold shadow-md shadow-[#C8A46A]/20"
                        : disabled
                        ? "opacity-20 cursor-not-allowed border-transparent text-[#929292]"
                        : "bg-[#111111] border-white/5 hover:border-[#C8A46A]/50 text-[#F8F6F2]"
                    }`}
                  >
                    <span>{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-[#E8DDCE]">
                Selected Date: <strong className="text-[#C8A46A]">{selectedDate}</strong>
              </div>
            )}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 border border-white/10 text-xs uppercase tracking-wider text-[#929292] hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!selectedDate) {
                  setBookingError("Please pick a date to continue.");
                  return;
                }
                setBookingError(null);
                setCurrentStep(4);
              }}
              disabled={!selectedDate}
              className="px-8 py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              <span>Continue to Time Slots</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: SELECT TIME ================= */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2] uppercase font-light">
              Step 4: Select Appointment Time
            </h2>
            <p className="text-xs text-[#929292] mt-1">
              Real-time available slots for {selectedDate} considering your {totalDuration}-minute treatment duration and breaks.
            </p>
          </div>

          {loadingSlots ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#C8A46A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-[#929292] uppercase tracking-wider">
                Verifying schedule availability with Madison Avenue Atelier...
              </p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="py-16 text-center bg-[#161616] p-8 border border-white/5">
              <CalendarIcon className="w-8 h-8 text-[#C8A46A] mx-auto mb-3" />
              <h4 className="font-serif text-xl text-[#F8F6F2] mb-2">No Slots Available</h4>
              <p className="text-xs text-[#929292] max-w-sm mx-auto mb-6">
                All appointments for this date are fully booked or conflict with breaks. Please choose another date or select &ldquo;Any Available Stylist&rdquo;.
              </p>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-[#C8A46A] text-[#111111] text-xs uppercase tracking-wider font-semibold"
              >
                Choose Another Date
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availableSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => {
                      if (slot.available) {
                        setSelectedTime(slot.time);
                        setBookingError(null);
                      }
                    }}
                    className={`py-3.5 px-3 text-xs text-center border transition-all ${
                      isSelected
                        ? "bg-[#C8A46A] border-[#C8A46A] text-black font-bold shadow-md shadow-[#C8A46A]/20"
                        : slot.available
                        ? "bg-[#161616] border-white/10 hover:border-[#C8A46A] text-[#F8F6F2]"
                        : "bg-[#111111] border-transparent text-[#929292]/30 cursor-not-allowed line-through"
                    }`}
                  >
                    <div>{formatTimeDisplay(slot.time)}</div>
                    {!slot.available && (
                      <span className="text-[9px] text-red-400 block no-underline">
                        {slot.reason || "Booked"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="pt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 border border-white/10 text-xs uppercase tracking-wider text-[#929292] hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!selectedTime) {
                  setBookingError("Please choose a time slot to continue.");
                  return;
                }
                setBookingError(null);
                setCurrentStep(5);
              }}
              disabled={!selectedTime}
              className="px-8 py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              <span>Continue to Guest Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 5: CUSTOMER DETAILS ================= */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2] uppercase font-light">
              Step 5: Client Information
            </h2>
            <p className="text-xs text-[#929292] mt-1">
              Guest reservations are fully supported without requiring prior registration.
            </p>
          </div>

          <div className="bg-[#161616] border border-white/5 p-6 sm:p-10 max-w-2xl mx-auto space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3.5 focus:outline-none focus:border-[#C8A46A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                  Email Address (For Confirmation Pass) *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="eleanor@luxury.com"
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3.5 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                  Mobile Phone (SMS & WhatsApp updates) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (212) 555-0199"
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3.5 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                Special Requests or Beverage Preferences (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, preferred sparkling wine, quiet suite requested, upcoming special occasion..."
                className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3.5 focus:outline-none focus:border-[#C8A46A]"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 border border-white/10 text-xs uppercase tracking-wider text-[#929292] hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!customerName || !customerEmail || !customerPhone) {
                  setBookingError("Please provide your full name, email, and phone number.");
                  return;
                }
                setBookingError(null);
                setCurrentStep(6);
              }}
              disabled={!customerName || !customerEmail || !customerPhone}
              className="px-8 py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              <span>Review Booking Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 6: BOOKING SUMMARY ================= */}
      {currentStep === 6 && (
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2] uppercase font-light">
              Step 6: Review & Finalize
            </h2>
            <p className="text-xs text-[#929292] mt-1">
              Please inspect your appointment details. Our real-time availability check will atomically secure your slot upon confirmation.
            </p>
          </div>

          <div className="bg-[#161616] border border-[#C8A46A]/30 p-8 sm:p-10 max-w-3xl mx-auto space-y-8">
            {/* Header info */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="font-serif text-2xl text-[#F8F6F2]">
                  ÉLIXIR HAUTE BEAUTÉ
                </span>
                <p className="text-xs text-[#C8A46A] uppercase tracking-widest mt-0.5">
                  Penthouse Atelier · 740 Madison Avenue
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#929292] uppercase tracking-wider block">
                  Total Investment
                </span>
                <span className="font-serif text-3xl text-[#C8A46A]">
                  ${totalPrice}
                </span>
              </div>
            </div>

            {/* Selected Rituals Breakdown */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#929292] mb-4">
                Selected Rituals & Durations
              </h4>
              <div className="space-y-3">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3.5 bg-[#111111] border border-white/5 text-xs"
                  >
                    <div>
                      <span className="text-[#F8F6F2] font-medium">{service.name}</span>
                      <span className="text-[#929292] block text-[11px]">
                        {service.durationMinutes} Minutes · Master Artisan Execution
                      </span>
                    </div>
                    <span className="font-serif text-base text-[#C8A46A]">
                      ${service.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule & Artisan Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-[#929292] uppercase tracking-wider block text-[10px] mb-1">
                  Artisan / Specialist
                </span>
                <span className="text-[#F8F6F2] text-sm font-serif">
                  {selectedStaff ? selectedStaff.name : "Any Available Master Stylist"}
                </span>
                <p className="text-[11px] text-[#C8A46A] mt-0.5">
                  {selectedStaff ? selectedStaff.title : "Assigned based on luxury protocol"}
                </p>
              </div>

              <div>
                <span className="text-[#929292] uppercase tracking-wider block text-[10px] mb-1">
                  Date & Time Slot
                </span>
                <span className="text-[#F8F6F2] text-sm font-serif">
                  {selectedDate} @ {formatTimeDisplay(selectedTime)}
                </span>
                <p className="text-[11px] text-[#929292] mt-0.5">
                  Estimated completion: {totalDuration} minutes
                </p>
              </div>

              <div>
                <span className="text-[#929292] uppercase tracking-wider block text-[10px] mb-1">
                  Patron Name
                </span>
                <span className="text-[#F8F6F2]">{customerName}</span>
                <p className="text-[11px] text-[#929292]">{customerEmail}</p>
              </div>

              <div>
                <span className="text-[#929292] uppercase tracking-wider block text-[10px] mb-1">
                  Contact Phone
                </span>
                <span className="text-[#F8F6F2]">{customerPhone}</span>
                {notes && (
                  <p className="text-[11px] text-[#E8DDCE] italic mt-1 line-clamp-1">
                    &ldquo;{notes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Reassurance Policy */}
            <div className="p-4 bg-[#111111] border border-[#C8A46A]/20 flex items-center gap-3 text-xs text-[#E8DDCE]">
              <ShieldCheck className="w-5 h-5 text-[#C8A46A] shrink-0" />
              <span>
                Complimentary 24-hour cancellation policy. No upfront deposit required for online reservations.
              </span>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(5)}
              disabled={submitting}
              className="px-6 py-3 border border-white/10 text-xs uppercase tracking-wider text-[#929292] hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={submitting}
              className="px-10 py-4 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#D8B57B] disabled:opacity-50 transition-all shadow-xl shadow-[#C8A46A]/20 flex items-center gap-3"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Securing Reservation...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 7: CONFIRMATION ================= */}
      {currentStep === 7 && confirmedBooking && (
        <div className="space-y-8 text-center max-w-2xl mx-auto py-8">
          {/* Animated Gold Checkmark */}
          <div className="w-20 h-20 rounded-full bg-[#C8A46A]/10 border-2 border-[#C8A46A] flex items-center justify-center mx-auto text-[#C8A46A] shadow-2xl shadow-[#C8A46A]/30">
            <Check className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C8A46A] font-medium block mb-2">
              Appointment Confirmed
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] uppercase font-light">
              We Await Your Presence
            </h2>
            <p className="text-xs text-[#929292] mt-2">
              A luxury confirmation pass has been dispatched to <strong>{confirmedBooking.customerEmail}</strong>.
            </p>
          </div>

          {/* Reference Pass Box */}
          <div className="bg-[#161616] border border-[#C8A46A]/40 p-8 text-left space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] text-[#929292] uppercase tracking-widest block">
                  Booking Reference
                </span>
                <span className="font-serif text-2xl text-[#C8A46A] font-bold tracking-wider">
                  {confirmedBooking.bookingReference}
                </span>
              </div>
              <div className="px-3 py-1 bg-[#C8A46A]/20 text-[#C8A46A] border border-[#C8A46A]/30 text-[10px] tracking-widest uppercase">
                {confirmedBooking.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#929292] block text-[10px] uppercase">Date</span>
                <span className="text-[#F8F6F2] font-serif text-base">{confirmedBooking.date}</span>
              </div>
              <div>
                <span className="text-[#929292] block text-[10px] uppercase">Time</span>
                <span className="text-[#F8F6F2] font-serif text-base">
                  {formatTimeDisplay(confirmedBooking.startTime)}
                </span>
              </div>
              <div>
                <span className="text-[#929292] block text-[10px] uppercase">Stylist</span>
                <span className="text-[#F8F6F2]">
                  {confirmedBooking.staff?.name || "Master Artisan"}
                </span>
              </div>
              <div>
                <span className="text-[#929292] block text-[10px] uppercase">Location</span>
                <span className="text-[#F8F6F2]">740 Madison Ave, Penthouse</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#929292]">Total Estimated Investment</span>
              <span className="font-serif text-xl text-[#C8A46A]">
                ${confirmedBooking.totalPrice}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3.5 border border-white/10 text-xs uppercase tracking-wider text-[#E8DDCE] hover:border-[#C8A46A] hover:text-[#C8A46A] transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Pass</span>
            </button>

            <a
              href={`https://wa.me/12128907733?text=Hello%20Concierge,%20I%20have%20confirmed%20my%20appointment%20with%20reference%20${confirmedBooking.bookingReference}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#1B1B1B] border border-[#C8A46A]/40 text-xs uppercase tracking-wider text-[#C8A46A] hover:bg-[#C8A46A] hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] transition-colors flex items-center justify-center gap-2"
            >
              <span>View in Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
