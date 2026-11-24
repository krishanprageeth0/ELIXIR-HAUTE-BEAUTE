import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWizard from "@/components/booking/BookingWizard";
import { prisma } from "@/lib/prisma";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book Your Appointment | ÉLIXIR HAUTE BEAUTÉ",
  description: "Bespoke online salon appointment booking. Select rituals, master stylists, and reserve your private suite in less than 60 seconds.",
};

export default async function BookPage() {
  const [services, staff] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { price: "desc" }],
    }),
    prisma.staff.findMany({
      where: { isActive: true },
      include: {
        schedules: { orderBy: { dayOfWeek: "asc" } },
      },
      orderBy: { rating: "desc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      {/* Header */}
      <section className="relative pt-36 pb-16 bg-[#161616] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Suite Reservation</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#F8F6F2] font-light uppercase tracking-wide mb-4">
            Book Your Appointment
          </h1>

          <p className="text-xs sm:text-sm text-[#E8DDCE]/80 font-light max-w-xl mx-auto">
            Reserve your bespoke hair couture or aesthetic ritual in less than 60 seconds with instant server confirmation.
          </p>
        </div>
      </section>

      {/* Booking Wizard Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12">
        <Suspense
          fallback={
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-[#C8A46A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-[#929292] uppercase tracking-wider">
                Initializing Atelier Booking Engine...
              </p>
            </div>
          }
        >
          <BookingWizard initialServices={services} initialStaff={staff} />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
