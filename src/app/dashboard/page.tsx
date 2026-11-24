import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomerDashboardClient from "@/components/dashboard/CustomerDashboardClient";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Dashboard | ÉLIXIR HAUTE BEAUTÉ",
  description: "Manage your luxury appointments, reschedule rituals, and view bespoke styling passes.",
};

export default async function DashboardPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/auth/login");
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      OR: [
        { customerId: session.userId },
        { customerEmail: session.email },
      ],
    },
    include: {
      staff: true,
      appointmentServices: {
        include: { service: true },
      },
    },
    orderBy: [{ date: "desc" }, { startTime: "asc" }],
  });

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-28">
        <CustomerDashboardClient initialAppointments={appointments as any} />
      </div>
      <Footer />
    </main>
  );
}
