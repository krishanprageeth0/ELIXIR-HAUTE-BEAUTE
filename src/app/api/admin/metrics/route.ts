import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Counts by status
    const [
      totalAppointments,
      todayAppointments,
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      allAppointments,
      staffList,
      servicesList,
    ] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { date: todayStr } }),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({ where: { status: "CONFIRMED" } }),
      prisma.appointment.count({ where: { status: "COMPLETED" } }),
      prisma.appointment.count({ where: { status: "CANCELLED" } }),
      prisma.appointment.findMany({
        select: {
          id: true,
          totalPrice: true,
          status: true,
          date: true,
          staffId: true,
          appointmentServices: {
            select: { serviceId: true, priceAtBooking: true },
          },
        },
      }),
      prisma.staff.findMany({
        select: { id: true, name: true, photo: true, title: true },
      }),
      prisma.service.findMany({
        select: { id: true, name: true, price: true },
      }),
    ]);

    // Calculate total revenue (confirmed + completed)
    const validAppointments = allAppointments.filter(
      (a) => a.status === "COMPLETED" || a.status === "CONFIRMED"
    );

    const totalRevenue = validAppointments.reduce((acc, a) => acc + a.totalPrice, 0);

    // Monthly revenue chart calculation
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenueMap: Record<string, number> = {};
    monthNames.forEach((m) => (monthlyRevenueMap[m] = 0));

    validAppointments.forEach((a) => {
      const monthIdx = new Date(a.date).getMonth();
      const mName = monthNames[monthIdx];
      if (mName) {
        monthlyRevenueMap[mName] += a.totalPrice;
      }
    });

    const monthlyRevenue = monthNames.map((name) => ({
      month: name,
      revenue: monthlyRevenueMap[name],
    }));

    // Staff performance: bookings count & revenue per stylist
    const staffPerformance = staffList.map((st) => {
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

    // Popular services
    const serviceBookingsCount: Record<string, number> = {};
    allAppointments.forEach((a) => {
      a.appointmentServices.forEach((as) => {
        serviceBookingsCount[as.serviceId] = (serviceBookingsCount[as.serviceId] || 0) + 1;
      });
    });

    const popularServices = servicesList
      .map((s) => ({
        id: s.id,
        name: s.name,
        bookings: serviceBookingsCount[s.id] || 0,
        price: s.price,
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Admin metrics error:", error);
    return NextResponse.json({ error: "Failed to compute admin metrics" }, { status: 500 });
  }
}
