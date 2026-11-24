import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { formatTimeDisplay } from "@/lib/booking-utils";
import { Check, Calendar, Clock, MapPin, Printer, Share2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const appointment = await prisma.appointment.findFirst({
    where: {
      OR: [{ id }, { bookingReference: id }],
    },
    include: {
      staff: true,
      appointmentServices: {
        include: { service: true },
      },
    },
  });

  if (!appointment) {
    notFound();
  }

  const settings = await prisma.salonSettings.findFirst();

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      <section className="pt-36 pb-24 max-w-3xl mx-auto px-6 sm:px-8">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-[#C8A46A]/10 border border-[#C8A46A] flex items-center justify-center mx-auto text-[#C8A46A] mb-4">
            <Check className="w-8 h-8" />
          </div>

          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46A] block mb-2">
            Confirmed Reservation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] uppercase font-light">
            Luxury Appointment Pass
          </h1>
          <p className="text-xs text-[#929292] mt-2">
            Thank you, {appointment.customerName}. Your private styling session has been secured in our calendar.
          </p>
        </div>

        {/* Digital Pass Card */}
        <div className="bg-[#161616] border border-[#C8A46A]/40 p-8 sm:p-10 relative overflow-hidden shadow-2xl shadow-black/80">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="font-serif text-2xl text-[#F8F6F2]">
                ÉLIXIR HAUTE BEAUTÉ
              </span>
              <p className="text-xs text-[#C8A46A] uppercase tracking-widest mt-0.5">
                Penthouse Level 4 · 740 Madison Avenue, NY
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] text-[#929292] uppercase tracking-wider block">
                Booking Reference
              </span>
              <span className="font-serif text-xl text-[#C8A46A] font-bold tracking-wider">
                {appointment.bookingReference}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-white/10 text-xs">
            <div>
              <span className="text-[#929292] uppercase tracking-wider block text-[10px] mb-1">
                Scheduled Date
              </span>
              <div className="flex items-center gap-2 text-sm text-[#F8F6F2] font-serif">
                <Calendar className="w-4 h-4 text-[#C8A46A]" />
                <span>{appointment.date}</span>
              </div>
            </div>

            <div>
              <span className="text-[#929292] uppercase tracking-wider block text-[10px] mb-1">
                Appointment Time
              </span>
              <div className="flex items-center gap-2 text-sm text-[#F8F6F2] font-serif">
                <Clock className="w-4 h-4 text-[#C8A46A]" />
                <span>{formatTimeDisplay(appointment.startTime)} ({appointment.totalDuration} min)</span>
              </div>
            </div>

            <div>
              <span className="text-[#929292] uppercase tracking-wider block text-[10px] mb-1">
                Dedicated Artisan
              </span>
              <span className="text-[#F8F6F2] text-sm font-serif">
                {appointment.staff?.name || "Master Stylist"}
              </span>
              <p className="text-[11px] text-[#C8A46A] mt-0.5">
                {appointment.staff?.title || "Haute Coiffure Specialist"}
              </p>
            </div>

            <div>
              <span className="text-[#929292] uppercase tracking-wider block text-[10px] mb-1">
                Status
              </span>
              <span className="inline-block px-3 py-1 bg-[#C8A46A]/20 text-[#C8A46A] border border-[#C8A46A]/30 text-[10px] tracking-widest uppercase">
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Services List */}
          <div className="py-6 border-b border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-[#929292] block mb-3">
              Reserved Rituals
            </span>
            <div className="space-y-3">
              {appointment.appointmentServices.map((as) => (
                <div
                  key={as.id}
                  className="flex items-center justify-between p-3 bg-[#111111] text-xs"
                >
                  <span className="text-[#F8F6F2] font-medium">{as.service.name}</span>
                  <span className="font-serif text-sm text-[#C8A46A]">${as.priceAtBooking}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Patron and Notes */}
          <div className="py-6 border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#929292] text-[10px] uppercase block">Client Name</span>
              <span className="text-[#F8F6F2]">{appointment.customerName}</span>
              <p className="text-[#929292] text-[11px]">{appointment.customerEmail}</p>
            </div>
            <div>
              <span className="text-[#929292] text-[10px] uppercase block">Client Contact</span>
              <span className="text-[#F8F6F2]">{appointment.customerPhone}</span>
              {appointment.notes && (
                <p className="text-[#E8DDCE] italic mt-1 text-[11px]">
                  &ldquo;{appointment.notes}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="pt-6 flex items-center justify-between">
            <span className="text-xs text-[#929292] uppercase tracking-wider">
              Total Estimated Investment
            </span>
            <span className="font-serif text-2xl text-[#C8A46A] font-bold">
              ${appointment.totalPrice}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#D8B57B] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C8A46A]/20"
          >
            <span>Customer Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={`https://wa.me/12128907733?text=Hello%20Concierge,%20regarding%20my%20booking%20${appointment.bookingReference}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#1B1B1B] border border-[#C8A46A]/40 text-[#C8A46A] text-xs uppercase tracking-wider hover:bg-[#C8A46A] hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Concierge</span>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
