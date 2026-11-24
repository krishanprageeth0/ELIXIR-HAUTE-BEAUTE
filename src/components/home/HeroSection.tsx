"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Sparkles, ChevronDown, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Cinematic Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        {/* Layered cinematic vignettes and tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-[#111111]/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-[#111111]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C8A46A]/10 via-transparent to-transparent" />
      </div>

      {/* Floating subtle ambient particles */}
      <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
        <motion.div
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 md:left-24 w-48 h-48 rounded-full bg-[#C8A46A]/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-10 md:right-28 w-64 h-64 rounded-full bg-[#E8DDCE]/5 blur-3xl"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        {/* Top Champagne Gold Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C8A46A]/30 bg-[#1B1B1B]/80 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C8A46A]" />
          <span className="text-[11px] md:text-xs tracking-[0.3em] uppercase text-[#E8DDCE] font-medium">
            Atelier Haute Coiffure · 2027
          </span>
        </motion.div>

        {/* Master Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F8F6F2] font-light tracking-[0.08em] uppercase leading-[1.08] mb-6"
        >
          Beauty is an <br />
          <span className="italic font-normal text-gold-gradient tracking-[0.04em]">
            Experience.
          </span>
        </motion.h1>

        {/* Supporting Editorial Prose */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-[#E8DDCE]/80 font-light max-w-2xl leading-relaxed mb-10 tracking-wide"
        >
          Discover your style. Experience the art of beauty. Private penthouse suites, master Parisian colorists, and cellular restorative treatments on Madison Avenue.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          <Link
            href="/book"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C8A46A] via-[#D8B57B] to-[#C8A46A] text-[#111111] font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,164,106,0.5)] hover:scale-105 flex items-center justify-center gap-3"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Your Appointment</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto px-8 py-4 border border-[#C8A46A]/40 bg-[#1B1B1B]/60 backdrop-blur-md text-[#F8F6F2] font-medium text-xs tracking-[0.25em] uppercase hover:border-[#C8A46A] hover:bg-[#C8A46A]/10 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Explore Our Services</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8A46A] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Luxury Badges Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 text-center"
        >
          <div>
            <div className="font-serif text-2xl text-[#C8A46A]">740</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#929292] mt-1">Madison Ave, NY</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-[#C8A46A]">14+</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#929292] mt-1">Couture Awards</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-[#C8A46A]">4.98 ★</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#929292] mt-1">VIP Satisfaction</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-[#C8A46A]">100%</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#929292] mt-1">Bespoke Rituals</div>
          </div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#C8A46A]/80">Scroll</span>
        <ChevronDown className="w-4 h-4 text-[#C8A46A]" />
      </motion.div>
    </section>
  );
}
