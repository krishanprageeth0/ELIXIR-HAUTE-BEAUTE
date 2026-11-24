import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactClient from "@/components/contact/ContactClient";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Concierge Desk & Location | ÉLIXIR HAUTE BEAUTÉ",
  description: "Connect with our Madison Avenue concierge desk for bespoke bookings, private penthouse suites, and custom consultations.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      {/* Header */}
      <section className="relative pt-36 pb-20 bg-[#161616] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Madison Avenue Atelier</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F8F6F2] font-light uppercase tracking-wide mb-6">
            Contact & Concierge
          </h1>

          <p className="text-sm sm:text-base text-[#E8DDCE]/80 font-light max-w-2xl mx-auto leading-relaxed">
            Located in Manhattan&apos;s historic luxury district. We invite you to connect with our concierge for appointments, private suites, and custom beauty consultations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <ContactClient />
      </div>

      <Footer />
    </main>
  );
}
