import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-24 text-xs leading-relaxed space-y-6 text-[#929292]">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] uppercase font-light mb-6">
          Terms of Atelier Service
        </h1>
        <p>
          Reservations at ÉLIXIR Haute Beauté are held in private penthouse suites. We respectfully request at least 24 hours notice for any cancellation or rescheduling of appointments.
        </p>
        <p>
          Appointments exceeding 90 minutes include complimentary beverage concierge service and diagnostic scalp profiling. All prices are stated in USD and subject to local sales tax where applicable.
        </p>
      </div>
      <Footer />
    </main>
  );
}
