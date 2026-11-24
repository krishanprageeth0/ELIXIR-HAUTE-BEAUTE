"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Sparkles, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  price: number;
  image: string;
  category: { name: string; slug: string };
}

export default function FeaturedServices({
  categories,
  services,
}: {
  categories: Category[];
  services: Service[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? services
    : services.filter((s) => s.category.slug === activeCategory);

  return (
    <section className="py-28 bg-[#111111] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#C8A46A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haute Coiffure & Aesthetics</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F8F6F2] font-light tracking-[0.05em] uppercase">
              Curated Services
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C8A46A] hover:text-[#E8DDCE] transition-colors group"
          >
            <span>View Full Treatment Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-6 mb-12">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-none text-xs tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-all duration-300 ${
              activeCategory === "all"
                ? "bg-[#C8A46A] text-[#111111] shadow-lg shadow-[#C8A46A]/20"
                : "bg-[#1B1B1B] text-[#929292] hover:text-[#F8F6F2] border border-white/5"
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-none text-xs tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.slug
                  ? "bg-[#C8A46A] text-[#111111] shadow-lg shadow-[#C8A46A]/20"
                  : "bg-[#1B1B1B] text-[#929292] hover:text-[#F8F6F2] border border-white/5"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filtered.slice(0, 6).map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-[#181818] border border-white/5 hover:border-[#C8A46A]/40 transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80" />

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#111111]/80 backdrop-blur-md border border-white/10 text-[11px] text-[#E8DDCE] flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#C8A46A]" />
                    <span>{service.durationMinutes} min</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 bg-[#C8A46A]/20 text-[#C8A46A] border border-[#C8A46A]/30">
                    {service.category.name}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-[#F8F6F2] font-normal mb-2.5 group-hover:text-[#C8A46A] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#929292] leading-relaxed line-clamp-2 mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] tracking-widest text-[#929292] uppercase block">
                        Experience From
                      </span>
                      <span className="font-serif text-2xl text-[#C8A46A] font-light">
                        ${service.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/services/${service.slug}`}
                        className="px-3 py-2 text-xs text-[#929292] hover:text-[#F8F6F2] transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/book?service=${service.id}`}
                        className="px-4 py-2 bg-[#C8A46A] text-[#111111] font-semibold text-[11px] tracking-wider uppercase hover:bg-[#D8B57B] transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Book</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
