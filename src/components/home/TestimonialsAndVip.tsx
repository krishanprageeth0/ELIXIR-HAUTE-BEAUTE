import Image from "next/image";
import Link from "next/link";
import { Star, Quote, Calendar, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string | null;
}

export default function TestimonialsAndVip({ reviews }: { reviews: Review[] }) {
  return (
    <>
      {/* Testimonials */}
      <section className="py-24 bg-[#141414] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-3">
              <Star className="w-3.5 h-3.5 fill-[#C8A46A]" />
              <span>Client Acclaim</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] font-light uppercase tracking-wider">
              The Patron Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#191919] p-7 border border-white/5 hover:border-[#C8A46A]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C8A46A] mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C8A46A]" />
                    ))}
                  </div>

                  <p className="text-xs text-[#E8DDCE]/90 leading-relaxed italic mb-6">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                  {rev.avatar ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={rev.avatar}
                        alt={rev.customerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#C8A46A]/20 text-[#C8A46A] flex items-center justify-center text-xs font-serif font-bold">
                      {rev.customerName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="font-serif text-sm text-[#F8F6F2]">
                      {rev.customerName}
                    </div>
                    <div className="text-[10px] text-[#929292] tracking-wider uppercase">
                      {rev.serviceName}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atelier VIP Private Suites Showcase */}
      <section className="py-28 bg-[#111111] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Editorial Photos */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="relative h-96 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80"
                  alt="Penthouse Styling Suite"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-96 overflow-hidden mt-8">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
                  alt="Private Head Spa Rain Cascade"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>740 Madison Avenue, Penthouse</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] font-light uppercase leading-tight mb-6">
                The Sanctuary of Bespoke Luxury
              </h2>

              <p className="text-sm text-[#929292] leading-relaxed mb-6">
                Designed by Parisian architectural masters, ÉLIXIR combines travertine marble, acoustic sound isolation, and custom Italian wash lounges designed for absolute spine relaxation.
              </p>

              <div className="space-y-3.5 mb-8 text-xs text-[#E8DDCE]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A46A] shrink-0" />
                  <span>Private VIP styling chambers with discreet elevator access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A46A] shrink-0" />
                  <span>Complimentary vintage Dom Pérignon and bespoke botanical tea pairings</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A46A] shrink-0" />
                  <span>Cellular Japanese micro-mist and scalp oxygenation systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#C8A46A] shrink-0" />
                  <span>Medical-grade sterilization & certified organic French formulations</span>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C8A46A] hover:text-white transition-colors"
              >
                <span>Discover Our Design Philosophy</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* High-Impact Booking CTA Banner */}
      <section className="py-24 bg-gradient-to-r from-[#1A1815] via-[#211E17] to-[#1A1815] border-y border-[#C8A46A]/30 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="w-12 h-12 mx-auto rounded-full border border-[#C8A46A]/50 flex items-center justify-center mb-6">
            <span className="font-serif text-lg text-[#C8A46A]">É</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F8F6F2] font-light uppercase tracking-wide mb-6 leading-tight">
            Reserve Your Private Suite
          </h2>

          <p className="text-sm sm:text-base text-[#E8DDCE]/80 font-light max-w-xl mx-auto mb-10 leading-relaxed">
            Experience the pinnacle of international hair couture and facial aesthetics. Book seamlessly in less than 60 seconds with instant confirmation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto px-10 py-4 bg-[#C8A46A] text-[#111111] font-semibold text-xs tracking-[0.25em] uppercase hover:bg-[#D8B57B] transition-all duration-300 shadow-xl shadow-[#C8A46A]/20 flex items-center justify-center gap-3"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </Link>

            <a
              href="https://wa.me/12128907733"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-[#C8A46A]/40 bg-[#111111]/60 text-[#E8DDCE] font-medium text-xs tracking-[0.2em] uppercase hover:border-[#C8A46A] hover:text-white transition-colors"
            >
              Concierge WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
