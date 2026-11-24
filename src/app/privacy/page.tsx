import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-24 text-xs leading-relaxed space-y-6 text-[#929292]">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] uppercase font-light mb-6">
          Privacy Policy
        </h1>
        <p>
          At ÉLIXIR Haute Beauté, we are committed to upholding the utmost confidentiality for our patrons. Your personal contact details, consultation records, and service preferences are securely encrypted and never disclosed to third parties.
        </p>
        <p>
          We retain your appointment history solely to provide personalized styling recommendations and maintain seamless continuity with your dedicated artisan.
        </p>
      </div>
      <Footer />
    </main>
  );
}
