"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatTimeDisplay } from "@/lib/booking-utils";
import {
  Calendar,
  Clock,
  User,
  LogOut,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  X,
} from "lucide-react";

interface AppointmentService {
  id: string;
  priceAtBooking: number;
  durationAtBooking: number;
  service: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
}

interface Appointment {
  id: string;
  bookingReference: string;
  date: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  cancellationReason?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string | null;
  staff?: {
    id: string;
    name: string;
    title: string;
    photo: string;
  } | null;
  appointmentServices: AppointmentService[];
}

export default function CustomerDashboardClient({
  initialAppointments,
}: {
  initialAppointments: Appointment[];
}) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history" | "profile">("upcoming");

  // Cancellation modal state
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // Reschedule modal state
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const upcomingAppointments = appointments.filter(
    (a) => a.date >= todayStr && a.status !== "CANCELLED" && a.status !== "COMPLETED"
  );

  const pastAppointments = appointments.filter(
    (a) => a.date < todayStr || a.status === "CANCELLED" || a.status === "COMPLETED"
  );

  const handleCancel = async () => {
    if (!cancellingApt) return;
    setCancelLoading(true);

    try {
      const res = await fetch(`/api/appointments/${cancellingApt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CANCEL",
          cancellationReason: cancelReason || "Cancelled by client via dashboard",
        }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === cancellingApt.id
              ? { ...a, status: "CANCELLED", cancellationReason: cancelReason }
              : a
          )
        );
        setCancellingApt(null);
        setCancelReason("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!reschedulingApt || !newDate || !newTime) return;
    setRescheduleLoading(true);
    setRescheduleError(null);

    try {
      const res = await fetch(`/api/appointments/${reschedulingApt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RESCHEDULE",
          newDate,
          newStartTime: newTime,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reschedule. Slot might be unavailable.");
      }

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === reschedulingApt.id
            ? { ...a, date: newDate, startTime: newTime, status: "CONFIRMED" }
            : a
        )
      );
      setReschedulingApt(null);
      setNewDate("");
      setNewTime("");
    } catch (err: any) {
      setRescheduleError(err.message || "Failed to reschedule.");
    } finally {
      setRescheduleLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] tracking-widest uppercase">
            Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2.5 py-0.5 bg-amber-950/60 border border-amber-500/40 text-amber-400 text-[10px] tracking-widest uppercase">
            Pending
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-0.5 bg-[#1B1B1B] border border-white/20 text-[#929292] text-[10px] tracking-widest uppercase">
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-0.5 bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] tracking-widest uppercase">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 bg-white/10 text-[#E8DDCE] text-[10px] uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="py-12">
      {/* Top Welcome Card */}
      <div className="bg-[#161616] border border-[#C8A46A]/20 p-8 sm:p-10 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full border border-[#C8A46A]/40 bg-[#111111] flex items-center justify-center font-serif text-2xl text-[#C8A46A]">
            {user?.name?.charAt(0) || "P"}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#C8A46A] mb-1 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Privilege Patron Circle</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2]">
              Welcome, {user?.name || "Patron"}
            </h1>
            <p className="text-xs text-[#929292] mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="px-6 py-3 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-wider hover:bg-[#D8B57B] transition-colors flex items-center gap-1.5 shadow-md shadow-[#C8A46A]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New Appointment</span>
          </Link>
          <button
            onClick={logout}
            className="p-3 border border-white/10 text-[#929292] hover:text-white hover:border-white/30 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-8">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition-all ${
            activeTab === "upcoming"
              ? "bg-[#C8A46A] text-[#111111] font-semibold"
              : "bg-[#181818] text-[#929292] hover:text-[#F8F6F2]"
          }`}
        >
          Upcoming Appointments ({upcomingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition-all ${
            activeTab === "history"
              ? "bg-[#C8A46A] text-[#111111] font-semibold"
              : "bg-[#181818] text-[#929292] hover:text-[#F8F6F2]"
          }`}
        >
          Past & History ({pastAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition-all ${
            activeTab === "profile"
              ? "bg-[#C8A46A] text-[#111111] font-semibold"
              : "bg-[#181818] text-[#929292] hover:text-[#F8F6F2]"
          }`}
        >
          Patron Profile
        </button>
      </div>

      {/* ================= TAB: UPCOMING APPOINTMENTS ================= */}
      {activeTab === "upcoming" && (
        <div className="space-y-6">
          {upcomingAppointments.length === 0 ? (
            <div className="bg-[#161616] p-12 text-center border border-white/5">
              <Calendar className="w-10 h-10 text-[#C8A46A] mx-auto mb-3" />
              <h3 className="font-serif text-xl text-[#F8F6F2] mb-1">
                No Upcoming Appointments
              </h3>
              <p className="text-xs text-[#929292] max-w-sm mx-auto mb-6">
                You currently have no scheduled treatments. Indulge in an architectural haircut or restorative scalp spa today.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-wider hover:bg-[#D8B57B]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Reserve Appointment</span>
              </Link>
            </div>
          ) : (
            upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-[#161616] border border-white/10 hover:border-[#C8A46A]/40 transition-colors p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg text-[#C8A46A] font-bold">
                      {apt.bookingReference}
                    </span>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div>
                    <h3 className="font-serif text-xl text-[#F8F6F2]">
                      {apt.appointmentServices.map((as) => as.service.name).join(" + ")}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#E8DDCE] mt-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C8A46A]" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C8A46A]" />
                        {formatTimeDisplay(apt.startTime)} ({apt.totalDuration} min)
                      </span>
                      {apt.staff && (
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#C8A46A]" />
                          With {apt.staff.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-[#929292] italic">
                      Notes: &ldquo;{apt.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex flex-col justify-between items-start md:items-end gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 shrink-0">
                  <div className="md:text-right">
                    <span className="text-[10px] text-[#929292] uppercase tracking-wider block">
                      Investment
                    </span>
                    <span className="font-serif text-2xl text-[#C8A46A]">
                      ${apt.totalPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/booking-confirmation/${apt.id}`}
                      className="px-4 py-2 bg-[#1B1B1B] text-xs uppercase tracking-wider text-[#E8DDCE] hover:text-white border border-white/10"
                    >
                      View Pass
                    </Link>

                    <button
                      onClick={() => {
                        setReschedulingApt(apt);
                        setNewDate(apt.date);
                        setNewTime(apt.startTime);
                      }}
                      className="px-4 py-2 border border-[#C8A46A]/30 text-[#C8A46A] hover:bg-[#C8A46A] hover:text-black text-xs uppercase tracking-wider transition-colors"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => setCancellingApt(apt)}
                      className="px-4 py-2 text-xs uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= TAB: APPOINTMENT HISTORY ================= */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {pastAppointments.length === 0 ? (
            <div className="bg-[#161616] p-12 text-center border border-white/5">
              <Clock className="w-10 h-10 text-[#C8A46A] mx-auto mb-3" />
              <h3 className="font-serif text-xl text-[#F8F6F2]">No Prior Appointments</h3>
              <p className="text-xs text-[#929292] mt-1">
                Your past completed and archived sessions will be chronicled here.
              </p>
            </div>
          ) : (
            pastAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-[#161616] p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-serif text-base text-[#F8F6F2]">
                      {apt.bookingReference}
                    </span>
                    {getStatusBadge(apt.status)}
                  </div>
                  <p className="text-xs text-[#C8A46A]">
                    {apt.appointmentServices.map((as) => as.service.name).join(", ")}
                  </p>
                  <p className="text-[11px] text-[#929292] mt-1">
                    {apt.date} at {formatTimeDisplay(apt.startTime)} · {apt.staff?.name || "Master Stylist"}
                  </p>
                  {apt.cancellationReason && (
                    <p className="text-[11px] text-red-400 mt-1 italic">
                      Reason: {apt.cancellationReason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-serif text-lg text-[#C8A46A]">
                    ${apt.totalPrice}
                  </span>
                  <Link
                    href={`/book?service=${apt.appointmentServices[0]?.service.id || ""}`}
                    className="px-4 py-2 bg-[#1B1B1B] text-xs uppercase tracking-wider text-[#C8A46A] hover:bg-[#C8A46A] hover:text-black border border-[#C8A46A]/30 transition-colors"
                  >
                    Re-Book
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= TAB: PATRON PROFILE ================= */}
      {activeTab === "profile" && (
        <div className="bg-[#161616] border border-white/5 p-8 sm:p-10 max-w-2xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-serif text-2xl text-[#F8F6F2]">
              Patron Profile & Preferences
            </h3>
            <p className="text-xs text-[#929292] mt-1">
              Manage your confidential client profile on record at the Madison Avenue Atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-[10px] text-[#929292] uppercase block mb-1">Legal Name</span>
              <span className="text-[#F8F6F2] text-sm">{user?.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#929292] uppercase block mb-1">Email Account</span>
              <span className="text-[#F8F6F2] text-sm">{user?.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#929292] uppercase block mb-1">Phone Number</span>
              <span className="text-[#F8F6F2] text-sm">{user?.phone || "+1 (555) 392-1084"}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#929292] uppercase block mb-1">Membership Status</span>
              <span className="text-[#C8A46A] text-sm font-serif">Private Haute Circle (Verified)</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#929292]">
              Concierge Accommodations
            </h4>
            <div className="p-4 bg-[#111111] text-xs text-[#E8DDCE] border border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A46A]" />
                <span>Preferred beverage: Sparkling water with lime & organic green tea</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A46A]" />
                <span>Private VIP suite preferred when available</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CANCEL APPOINTMENT MODAL ================= */}
      {cancellingApt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-red-500/30 p-8 max-w-md w-full relative">
            <button
              onClick={() => setCancellingApt(null)}
              className="absolute top-4 right-4 text-[#929292] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-red-300 mb-2">
              Cancel Appointment
            </h3>
            <p className="text-xs text-[#929292] leading-relaxed mb-6">
              Are you sure you wish to cancel booking <strong>{cancellingApt.bookingReference}</strong> scheduled for {cancellingApt.date} at {cancellingApt.startTime}?
            </p>

            <div className="mb-6">
              <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                Reason for cancellation (Optional)
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Schedule conflict, travel changes, illness..."
                className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCancellingApt(null)}
                className="px-4 py-2.5 text-xs uppercase tracking-wider text-[#929292] hover:text-white"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="px-6 py-2.5 bg-red-800 text-white text-xs uppercase tracking-wider hover:bg-red-700 transition-colors"
              >
                {cancelLoading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RESCHEDULE APPOINTMENT MODAL ================= */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#C8A46A]/40 p-8 max-w-md w-full relative">
            <button
              onClick={() => setReschedulingApt(null)}
              className="absolute top-4 right-4 text-[#929292] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-[#F8F6F2] mb-1">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-[#929292] mb-6">
              Modify date and time for booking <strong>{reschedulingApt.bookingReference}</strong>.
            </p>

            {rescheduleError && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
                {rescheduleError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                  New Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={newDate}
                  min={todayStr}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                  New Start Time (HH:mm)
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setReschedulingApt(null)}
                className="px-4 py-2.5 text-xs uppercase tracking-wider text-[#929292] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={rescheduleLoading}
                className="px-6 py-2.5 bg-[#C8A46A] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#D8B57B] transition-colors"
              >
                {rescheduleLoading ? "Checking & Rescheduling..." : "Save Rescheduled Time"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
