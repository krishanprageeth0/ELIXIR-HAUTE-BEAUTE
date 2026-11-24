import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, Sparkles, Lock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Management Atelier | ÉLIXIR HAUTE BEAUTÉ",
  description: "Executive administrative portal for appointments, revenue analytics, staff schedules, and services.",
};

export default async function AdminPage() {
  const session = await getCurrentUser();

  // If user is not logged in or not ADMIN, present a clean quick-access screen
  if (!session || session.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-[#0D0D0D] text-[#F8F6F2] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#141414] border border-[#C8A46A]/30 p-8 sm:p-10 text-center">
          <div className="w-14 h-14 rounded-full border border-[#C8A46A] bg-[#C8A46A]/10 flex items-center justify-center mx-auto mb-6 text-[#C8A46A]">
            <Shield className="w-7 h-7" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-2">
            Executive Portal
          </span>
          <h1 className="font-serif text-3xl text-[#F8F6F2] uppercase font-light mb-3">
            Admin Authentication
          </h1>
          <p className="text-xs text-[#929292] leading-relaxed mb-8">
            Access to the salon management suite, revenue reports, and stylist scheduling requires administrative authorization.
          </p>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="w-full py-3.5 bg-[#C8A46A] text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C8A46A]/20"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full py-3 border border-white/10 text-xs uppercase tracking-wider text-[#929292] hover:text-white block text-center transition-colors"
            >
              Return to Public Atelier
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Fetch full data for Admin
  const todayStr = new Date().toISOString().split("T")[0];

  const [
    totalAppointments,
    todayAppointments,
    pendingCount,
    confirmedCount,
    completedCount,
    cancelledCount,
    allAppointments,
    categories,
    services,
    staff,
    settings,
    notifications,
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { date: todayStr } }),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count({ where: { status: "CANCELLED" } }),
    prisma.appointment.findMany({
      include: {
        staff: true,
        appointmentServices: {
          include: { service: true },
        },
      },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
    }),
    prisma.category.findMany({ orderBy: { orderIndex: "asc" } }),
    prisma.service.findMany({
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    }),
    prisma.staff.findMany({
      include: { schedules: { orderBy: { dayOfWeek: "asc" } } },
      orderBy: { rating: "desc" },
    }),
    prisma.salonSettings.findFirst(),
    prisma.notification.findMany({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const validAppointments = allAppointments.filter(
    (a) => a.status === "COMPLETED" || a.status === "CONFIRMED"
  );
  const totalRevenue = validAppointments.reduce((acc, a) => acc + a.totalPrice, 0);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenueMap: Record<string, number> = {};
  monthNames.forEach((m) => (monthlyRevenueMap[m] = 0));
  validAppointments.forEach((a) => {
    const monthIdx = new Date(a.date).getMonth();
    const mName = monthNames[monthIdx];
    if (mName) monthlyRevenueMap[mName] += a.totalPrice;
  });
  const monthlyRevenue = monthNames.map((name) => ({
    month: name,
    revenue: monthlyRevenueMap[name],
  }));

  const staffPerformance = staff.map((st) => {
    const staffApts = validAppointments.filter((a) => a.staffId === st.id);
    const rev = staffApts.reduce((sum, a) => sum + a.totalPrice, 0);
    return {
      id: st.id,
      name: st.name,
      photo: st.photo,
      title: st.title,
      bookingsCount: staffApts.length,
      revenue: rev,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const serviceBookingsCount: Record<string, number> = {};
  allAppointments.forEach((a) => {
    a.appointmentServices.forEach((as) => {
      serviceBookingsCount[as.serviceId] = (serviceBookingsCount[as.serviceId] || 0) + 1;
    });
  });
  const popularServices = services
    .map((s) => ({
      id: s.id,
      name: s.name,
      bookings: serviceBookingsCount[s.id] || 0,
      price: s.price,
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  const metrics = {
    metrics: {
      totalAppointments,
      todayAppointments,
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      totalRevenue,
    },
    monthlyRevenue,
    staffPerformance,
    popularServices,
  };

  return (
    <AdminDashboardClient
      initialMetrics={metrics}
      initialAppointments={allAppointments}
      initialServices={services}
      initialCategories={categories}
      initialStaff={staff}
      initialSettings={settings || {}}
      initialNotifications={notifications}
    />
  );
}
