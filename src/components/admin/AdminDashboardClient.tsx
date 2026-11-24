"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatTimeDisplay } from "@/lib/booking-utils";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Settings,
  DollarSign,
  TrendingUp,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Bell,
  LogOut,
  ExternalLink,
  ChevronDown,
  X,
  Phone,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";

interface AdminDashboardProps {
  initialMetrics: any;
  initialAppointments: any[];
  initialServices: any[];
  initialCategories: any[];
  initialStaff: any[];
  initialSettings: any;
  initialNotifications: any[];
}

export default function AdminDashboardClient({
  initialMetrics,
  initialAppointments,
  initialServices,
  initialCategories,
  initialStaff,
  initialSettings,
  initialNotifications,
}: AdminDashboardProps) {
  // Navigation state
  const [activeTab, setActiveTab] = useState<
    "overview" | "appointments" | "services" | "staff" | "settings" | "notifications"
  >("overview");

  // Appointments state
  const [appointments, setAppointments] = useState<any[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [staffFilter, setStaffFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  // Services state
  const [services, setServices] = useState<any[]>(initialServices);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [newService, setNewService] = useState({
    name: "",
    categoryId: initialCategories[0]?.id || "",
    description: "",
    durationMinutes: 60,
    price: 150,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
  });

  // Staff state
  const [staffList, setStaffList] = useState<any[]>(initialStaff);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: "",
    title: "Master Artisan",
    bio: "",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    experienceYears: 8,
    specializations: "Haute Coiffure, Precision Sculpting",
    instagram: "@artisan.couture",
    email: "",
    phone: "",
  });

  // Salon Settings state
  const [settings, setSettings] = useState(initialSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<any[]>(initialNotifications);

  // Status changer for an appointment
  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment({ ...selectedAppointment, status: newStatus });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add new service
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });
      const data = await res.json();
      if (res.ok && data.service) {
        setServices([data.service, ...services]);
        setIsAddServiceOpen(false);
        setNewService({
          name: "",
          categoryId: initialCategories[0]?.id || "",
          description: "",
          durationMinutes: 60,
          price: 150,
          image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
          isFeatured: false,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Edit service
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });
      const data = await res.json();
      if (res.ok && data.service) {
        setServices(services.map((s) => (s.id === data.service.id ? data.service : s)));
        setEditingService(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete service
  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to remove this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add new staff
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });
      const data = await res.json();
      if (res.ok && data.staff) {
        setStaffList([data.staff, ...staffList]);
        setIsAddStaffOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save salon settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/salon/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchesStaff = staffFilter === "ALL" || a.staffId === staffFilter;
    const matchesDate = !dateFilter || a.date === dateFilter;

    return matchesSearch && matchesStatus && matchesStaff && matchesDate;
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F8F6F2] flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#111111] border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
            <div className="w-8 h-8 rounded-full border border-[#C8A46A]/60 flex items-center justify-center">
              <span className="font-serif text-xs text-[#C8A46A] font-bold">É</span>
            </div>
            <div>
              <span className="font-serif text-sm tracking-[0.2em] uppercase font-light block">
                Élixir Atelier
              </span>
              <span className="text-[9px] text-[#C8A46A] uppercase tracking-widest block font-medium">
                Admin Studio 2027
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none tracking-wider uppercase font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-[#C8A46A] text-black font-semibold"
                  : "text-[#929292] hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("appointments")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-none tracking-wider uppercase font-medium transition-colors ${
                activeTab === "appointments"
                  ? "bg-[#C8A46A] text-black font-semibold"
                  : "text-[#929292] hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Bookings</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-black/30 rounded">
                {appointments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none tracking-wider uppercase font-medium transition-colors ${
                activeTab === "services"
                  ? "bg-[#C8A46A] text-black font-semibold"
                  : "text-[#929292] hover:text-white hover:bg-white/5"
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Services</span>
            </button>

            <button
              onClick={() => setActiveTab("staff")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none tracking-wider uppercase font-medium transition-colors ${
                activeTab === "staff"
                  ? "bg-[#C8A46A] text-black font-semibold"
                  : "text-[#929292] hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Stylists</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none tracking-wider uppercase font-medium transition-colors ${
                activeTab === "settings"
                  ? "bg-[#C8A46A] text-black font-semibold"
                  : "text-[#929292] hover:text-white hover:bg-white/5"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Salon Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-none tracking-wider uppercase font-medium transition-colors ${
                activeTab === "notifications"
                  ? "bg-[#C8A46A] text-black font-semibold"
                  : "text-[#929292] hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Alerts</span>
              </div>
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#C8A46A]" />
              )}
            </button>
          </nav>
        </div>

        {/* Footer links */}
        <div className="pt-6 border-t border-white/5 space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#929292] hover:text-[#C8A46A] px-2 py-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Atelier</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[#929292] hover:text-white px-2 py-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* ================= SECTION: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* Header */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-1">
                Executive Dashboard
              </span>
              <h1 className="font-serif text-3xl text-[#F8F6F2] uppercase font-light">
                Atelier Intelligence & Metrics
              </h1>
            </div>

            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#141414] border border-white/5 p-6">
                <span className="text-[10px] uppercase tracking-wider text-[#929292] block mb-1">
                  Total Revenue
                </span>
                <span className="font-serif text-3xl text-[#C8A46A] font-light">
                  ${initialMetrics?.metrics?.totalRevenue || 0}
                </span>
                <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Confirmed Bookings
                </p>
              </div>

              <div className="bg-[#141414] border border-white/5 p-6">
                <span className="text-[10px] uppercase tracking-wider text-[#929292] block mb-1">
                  Total Bookings
                </span>
                <span className="font-serif text-3xl text-[#F8F6F2] font-light">
                  {initialMetrics?.metrics?.totalAppointments || 0}
                </span>
                <p className="text-[10px] text-[#929292] mt-2">
                  {initialMetrics?.metrics?.todayAppointments || 0} Today
                </p>
              </div>

              <div className="bg-[#141414] border border-white/5 p-6">
                <span className="text-[10px] uppercase tracking-wider text-[#929292] block mb-1">
                  Confirmed Suites
                </span>
                <span className="font-serif text-3xl text-emerald-400 font-light">
                  {initialMetrics?.metrics?.confirmedCount || 0}
                </span>
                <p className="text-[10px] text-[#929292] mt-2">
                  {initialMetrics?.metrics?.pendingCount || 0} Pending
                </p>
              </div>

              <div className="bg-[#141414] border border-white/5 p-6">
                <span className="text-[10px] uppercase tracking-wider text-[#929292] block mb-1">
                  Master Artisans
                </span>
                <span className="font-serif text-3xl text-[#E8DDCE] font-light">
                  {staffList.length}
                </span>
                <p className="text-[10px] text-[#929292] mt-2">
                  100% Active On Schedule
                </p>
              </div>
            </div>

            {/* Monthly Revenue Bar Chart Simulation */}
            <div className="bg-[#141414] border border-white/5 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-serif text-xl text-[#F8F6F2] uppercase">
                    Monthly Revenue Trends (2027)
                  </h3>
                  <p className="text-xs text-[#929292] mt-0.5">
                    Monthly cumulative booking revenue from Madison Avenue private suites
                  </p>
                </div>
                <span className="text-xs text-[#C8A46A] uppercase tracking-wider font-semibold">
                  USD ($)
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2 h-44 items-end pt-8 border-b border-white/10 pb-2">
                {(initialMetrics?.monthlyRevenue || []).map((m: any, idx: number) => {
                  const maxRev = Math.max(...(initialMetrics?.monthlyRevenue?.map((x: any) => x.revenue) || [1000]), 1000);
                  const heightPercent = Math.max(Math.round((m.revenue / maxRev) * 100), 8);

                  return (
                    <div key={m.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] text-[#C8A46A] opacity-0 group-hover:opacity-100 transition-opacity">
                        ${m.revenue}
                      </div>
                      <div
                        className="w-full bg-[#1F1F1F] group-hover:bg-[#C8A46A] transition-colors relative"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] text-[#929292] uppercase mt-2">
                        {m.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Staff Performance & Popular Services Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Staff Leaderboard */}
              <div className="bg-[#141414] border border-white/5 p-8">
                <h3 className="font-serif text-lg text-[#F8F6F2] uppercase mb-6">
                  Artisan Performance & Volume
                </h3>
                <div className="space-y-4">
                  {(initialMetrics?.staffPerformance || []).map((st: any) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-3.5 bg-[#181818] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#C8A46A]/30">
                          <Image src={st.photo} alt={st.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="text-[#F8F6F2] font-medium">{st.name}</div>
                          <div className="text-[10px] text-[#929292]">{st.title}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-sm text-[#C8A46A]">${st.revenue}</div>
                        <div className="text-[10px] text-[#929292]">{st.bookingsCount} sessions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Services */}
              <div className="bg-[#141414] border border-white/5 p-8">
                <h3 className="font-serif text-lg text-[#F8F6F2] uppercase mb-6">
                  Top Booked Curations
                </h3>
                <div className="space-y-4">
                  {(initialMetrics?.popularServices || []).map((srv: any, idx: number) => (
                    <div
                      key={srv.id}
                      className="flex items-center justify-between p-3.5 bg-[#181818] border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-sm text-[#C8A46A] w-5">
                          0{idx + 1}
                        </span>
                        <div>
                          <div className="text-[#F8F6F2] font-medium">{srv.name}</div>
                          <div className="text-[10px] text-[#929292]">${srv.price} Investment</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-[#111111] text-[#E8DDCE] text-[10px] border border-white/5">
                        {srv.bookings} Bookings
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: APPOINTMENTS ================= */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-1">
                  Schedule Management
                </span>
                <h2 className="font-serif text-3xl text-[#F8F6F2] uppercase font-light">
                  Client Bookings ({filteredAppointments.length})
                </h2>
              </div>

              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8A46A] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#D8B57B]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Booking</span>
              </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#141414] p-4 border border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#929292]" />
                <input
                  type="text"
                  placeholder="Search ref, client, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#181818] border border-white/10 text-xs text-[#E8DDCE] px-3 py-2.5 focus:outline-none focus:border-[#C8A46A]"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>

              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="bg-[#181818] border border-white/10 text-xs text-[#E8DDCE] px-3 py-2.5 focus:outline-none focus:border-[#C8A46A]"
              >
                <option value="ALL">All Stylists</option>
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-[#181818] border border-white/10 text-xs text-[#E8DDCE] px-3 py-2 focus:outline-none focus:border-[#C8A46A]"
              />
            </div>

            {/* Appointments Table */}
            <div className="bg-[#141414] border border-white/5 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#929292] uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-6">Reference</th>
                    <th className="py-4 px-6">Client</th>
                    <th className="py-4 px-6">Date & Slot</th>
                    <th className="py-4 px-6">Stylist</th>
                    <th className="py-4 px-6">Investment</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-[#929292]">
                        No appointments match current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 font-mono text-[#C8A46A] font-semibold">
                          {apt.bookingReference}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-[#F8F6F2]">{apt.customerName}</div>
                          <div className="text-[11px] text-[#929292]">{apt.customerPhone}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[#F8F6F2]">{apt.date}</div>
                          <div className="text-[11px] text-[#929292]">
                            {formatTimeDisplay(apt.startTime)} ({apt.totalDuration} min)
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[#E8DDCE]">
                          {apt.staff?.name || "Master Stylist"}
                        </td>
                        <td className="py-4 px-6 font-serif text-sm text-[#C8A46A]">
                          ${apt.totalPrice}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={apt.status}
                            onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                            className="bg-[#181818] border border-white/10 text-[11px] text-[#E8DDCE] px-2 py-1 rounded cursor-pointer"
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="NO_SHOW">NO_SHOW</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="px-3 py-1 bg-[#1B1B1B] border border-white/10 text-[#E8DDCE] hover:text-white"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= SECTION: SERVICES MANAGEMENT ================= */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-1">
                  Atelier Catalog
                </span>
                <h2 className="font-serif text-3xl text-[#F8F6F2] uppercase font-light">
                  Services & Pricing ({services.length})
                </h2>
              </div>

              <button
                onClick={() => setIsAddServiceOpen(true)}
                className="px-5 py-2.5 bg-[#C8A46A] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#D8B57B] flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-[#141414] border border-white/5 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full mb-4 overflow-hidden border border-white/5">
                      <Image src={srv.image} alt={srv.name} fill className="object-cover" />
                      <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-black/80 text-[10px] text-[#C8A46A]">
                        {srv.durationMinutes} min
                      </div>
                    </div>

                    <div className="text-[10px] text-[#C8A46A] uppercase tracking-wider mb-1">
                      {srv.category?.name || "Ritual"}
                    </div>
                    <h3 className="font-serif text-lg text-[#F8F6F2] mb-1">{srv.name}</h3>
                    <p className="text-xs text-[#929292] line-clamp-2 mb-4 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="font-serif text-xl text-[#C8A46A]">${srv.price}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingService(srv)}
                        className="p-2 text-[#929292] hover:text-[#C8A46A] hover:bg-white/5"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: STAFF MANAGEMENT ================= */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-1">
                  Artistic Directors & Team
                </span>
                <h2 className="font-serif text-3xl text-[#F8F6F2] uppercase font-light">
                  Staff Roster ({staffList.length})
                </h2>
              </div>

              <button
                onClick={() => setIsAddStaffOpen(true)}
                className="px-5 py-2.5 bg-[#C8A46A] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#D8B57B] flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stylist</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((st) => (
                <div
                  key={st.id}
                  className="bg-[#141414] border border-white/5 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#C8A46A]/30">
                        <Image src={st.photo} alt={st.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-[#F8F6F2]">{st.name}</h3>
                        <p className="text-[11px] text-[#C8A46A] uppercase tracking-wider">
                          {st.title}
                        </p>
                        <div className="text-[10px] text-[#929292] mt-0.5">
                          ★ {st.rating.toFixed(2)} · {st.experienceYears} Yrs Mastery
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#929292] line-clamp-3 mb-4 leading-relaxed">
                      {st.bio}
                    </p>

                    <div className="text-[10px] text-[#E8DDCE] mb-4">
                      <strong className="text-[#929292] block uppercase mb-1">Specialties</strong>
                      {st.specializations}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#929292]">
                    <span>{st.instagram || "@elixir"}</span>
                    <span className="text-emerald-400">● Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: SALON SETTINGS ================= */}
        {activeTab === "settings" && (
          <div className="max-w-3xl space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-1">
                Atelier Parameters
              </span>
              <h2 className="font-serif text-3xl text-[#F8F6F2] uppercase font-light">
                Salon Configuration & Policies
              </h2>
            </div>

            {settingsSaved && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Salon settings saved successfully.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-[#141414] border border-white/5 p-8 space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Salon Name
                  </label>
                  <input
                    type="text"
                    value={settings.salonName}
                    onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Concierge Phone
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Concierge Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                  Atelier Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Opening Time (HH:mm)
                  </label>
                  <input
                    type="time"
                    value={settings.openingTime}
                    onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Closing Time (HH:mm)
                  </label>
                  <input
                    type="time"
                    value={settings.closingTime}
                    onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Cancellation Notice (Hours)
                  </label>
                  <input
                    type="number"
                    value={settings.cancellationHoursNotice}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cancellationHoursNotice: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-3 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#C8A46A] text-black font-semibold uppercase tracking-wider text-xs hover:bg-[#D8B57B] flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Atelier Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= SECTION: NOTIFICATIONS ================= */}
        {activeTab === "notifications" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-1">
                Real-Time Dispatch
              </span>
              <h2 className="font-serif text-3xl text-[#F8F6F2] uppercase font-light">
                Atelier Notifications
              </h2>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-5 bg-[#141414] border border-white/5 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#C8A46A]">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-[#929292]">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-[#E8DDCE]/80">{notif.message}</p>
                  </div>
                  {notif.link && (
                    <button
                      onClick={() => setActiveTab("appointments")}
                      className="text-xs text-[#C8A46A] hover:underline shrink-0"
                    >
                      View
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: APPOINTMENT DETAILS ================= */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#C8A46A]/30 p-8 max-w-lg w-full relative">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 text-[#929292] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] uppercase tracking-widest text-[#C8A46A] block mb-1">
              Booking Dossier
            </span>
            <h3 className="font-serif text-2xl text-[#F8F6F2] mb-4">
              {selectedAppointment.bookingReference}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] text-[#929292] uppercase block">Client</span>
                  <span className="text-[#F8F6F2] text-sm font-medium">
                    {selectedAppointment.customerName}
                  </span>
                  <p className="text-[#929292] text-[11px]">{selectedAppointment.customerEmail}</p>
                  <p className="text-[#929292] text-[11px]">{selectedAppointment.customerPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#929292] uppercase block">Scheduled Time</span>
                  <span className="text-[#F8F6F2] text-sm">
                    {selectedAppointment.date} @ {formatTimeDisplay(selectedAppointment.startTime)}
                  </span>
                  <p className="text-[11px] text-[#C8A46A] mt-1">
                    Stylist: {selectedAppointment.staff?.name || "Unassigned"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#929292] uppercase block mb-2">Services</span>
                <div className="space-y-2">
                  {selectedAppointment.appointmentServices?.map((as: any) => (
                    <div key={as.id} className="flex items-center justify-between p-2 bg-[#181818]">
                      <span>{as.service.name}</span>
                      <span className="font-serif text-[#C8A46A]">${as.priceAtBooking}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 bg-[#181818] text-[#E8DDCE] italic">
                  Notes: &ldquo;{selectedAppointment.notes}&rdquo;
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs uppercase text-[#929292]">Total Price</span>
                <span className="font-serif text-2xl text-[#C8A46A]">
                  ${selectedAppointment.totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SERVICE ================= */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#C8A46A]/30 p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsAddServiceOpen(false)}
              className="absolute top-4 right-4 text-[#929292] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-[#F8F6F2] mb-4">Add New Ritual</h3>

            <form onSubmit={handleAddService} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Nordic Platinum Gloss"
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                  Category
                </label>
                <select
                  value={newService.categoryId}
                  onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                >
                  {initialCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({ ...newService, price: parseFloat(e.target.value) })
                    }
                    className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={newService.durationMinutes}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        durationMinutes: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={newService.image}
                  onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="px-4 py-2 text-[#929292]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C8A46A] text-black font-semibold uppercase tracking-wider"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD STYLIST ================= */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#C8A46A]/30 p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsAddStaffOpen(false)}
              className="absolute top-4 right-4 text-[#929292] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-[#F8F6F2] mb-4">Add Master Stylist</h3>

            <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Jean-Paul Gaultier"
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                  Atelier Title
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.title}
                  onChange={(e) => setNewStaff({ ...newStaff, title: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                  Specialties (Comma Separated)
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.specializations}
                  onChange={(e) => setNewStaff({ ...newStaff, specializations: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  required
                  value={newStaff.photo}
                  onChange={(e) => setNewStaff({ ...newStaff, photo: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-1">
                  Biography
                </label>
                <textarea
                  rows={3}
                  required
                  value={newStaff.bio}
                  onChange={(e) => setNewStaff({ ...newStaff, bio: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] p-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 text-[#929292]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C8A46A] text-black font-semibold uppercase tracking-wider"
                >
                  Save Stylist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
