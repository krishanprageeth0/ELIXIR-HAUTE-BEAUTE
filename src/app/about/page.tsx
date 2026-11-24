import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Award, ShieldCheck, Heart, Leaf, Calendar } from "lucide-react";

export const metadata = {
  title: "About The Maison | ÉLIXIR HAUTE BEAUTÉ",
  description: "Learn about the heritage, architectural sanctuary, and artistic philosophy of ÉLIXIR Haute Beauté on Madison Avenue.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-24 bg-[#161616] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Heritage</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F8F6F2] font-light uppercase tracking-wide mb-6">
            Where Artistry Meets Transcendence
          </h1>

          <p className="text-sm sm:text-base text-[#E8DDCE]/80 font-light max-w-2xl mx-auto leading-relaxed">
            Founded with the belief that hair and aesthetic rituals should transcend ordinary grooming to become an intimate journey of self-expression and restoration.
          </p>
        </div>
      </section>

      {/* Narrative Section 1 */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative h-[450px] overflow-hidden border border-[#C8A46A]/20">
            <Image
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80"
              alt="Atelier Penthouse"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs text-[#C8A46A] tracking-[0.3em] uppercase block mb-3">
              The Penthouse Sanctuary
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] font-light uppercase leading-snug mb-6">
              An Architectural Haven on Madison Avenue
            </h2>
            <p className="text-sm text-[#929292] leading-relaxed mb-6 font-light">
              Perched on the penthouse level of 740 Madison Avenue, ÉLIXIR was conceptualized by Parisian interior architects to dissolve the noise of the city. We incorporated acoustic dampening walls, natural travertine stone from Tivoli, and warm 2700K ambient illumination calibrated specifically for accurate hair color rendering.
            </p>
            <p className="text-sm text-[#929292] leading-relaxed mb-8 font-light">
              Every client enjoys private isolation suites, preventing exposure to unwanted salon commotion, paired with ergonomic Italian reclining wash lounges that support full spine decompression.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 text-center">
              <div>
                <div className="font-serif text-2xl text-[#C8A46A]">2027</div>
                <div className="text-[10px] uppercase text-[#929292] mt-1">Futuristic Vision</div>
              </div>
              <div>
                <div className="font-serif text-2xl text-[#C8A46A]">6</div>
                <div className="text-[10px] uppercase text-[#929292] mt-1">Private Suites</div>
              </div>
              <div>
                <div className="font-serif text-2xl text-[#C8A46A]">100%</div>
                <div className="text-[10px] uppercase text-[#929292] mt-1">Cruelty-Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Standards */}
      <section className="py-24 bg-[#161616] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs text-[#C8A46A] tracking-[0.3em] uppercase block mb-3">
              Our Pillars
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] font-light uppercase">
              The Four Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-[#111111] border border-white/5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#C8A46A]/40 flex items-center justify-center text-[#C8A46A] mb-6">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#F8F6F2] mb-3">Runway Precision</h3>
              <p className="text-xs text-[#929292] leading-relaxed">
                Techniques honed during Fashion Weeks in Paris, Milan, and New York adapted for everyday effortless longevity.
              </p>
            </div>

            <div className="p-8 bg-[#111111] border border-white/5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#C8A46A]/40 flex items-center justify-center text-[#C8A46A] mb-6">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#F8F6F2] mb-3">Clean Formulations</h3>
              <p className="text-xs text-[#929292] leading-relaxed">
                Free from ammonia, parabens, sulfates, and harsh formaldehydes. We utilize organic botanical lipids and bio-identical peptides.
              </p>
            </div>

            <div className="p-8 bg-[#111111] border border-white/5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#C8A46A]/40 flex items-center justify-center text-[#C8A46A] mb-6">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#F8F6F2] mb-3">Cellular Care</h3>
              <p className="text-xs text-[#929292] leading-relaxed">
                We believe true beauty begins at the cellular level. Every treatment repairs the hair cuticle and scalp microbiome.
              </p>
            </div>

            <div className="p-8 bg-[#111111] border border-white/5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-[#C8A46A]/40 flex items-center justify-center text-[#C8A46A] mb-6">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#F8F6F2] mb-3">Bespoke Hospitality</h3>
              <p className="text-xs text-[#929292] leading-relaxed">
                From vintage French champagne pairings to personalized music playlists in your suite, every detail is custom to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] font-light uppercase mb-6">
            Begin Your Transformation
          </h2>
          <p className="text-sm text-[#929292] leading-relaxed mb-8">
            Experience why ÉLIXIR is revered by Manhattan&apos;s most discerning patrons.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#C8A46A] text-[#111111] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#D8B57B] transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Your Consultation</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
