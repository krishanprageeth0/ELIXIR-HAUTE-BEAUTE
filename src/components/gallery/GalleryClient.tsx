"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Calendar, ArrowRight, Eye, Layers } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  beforeImage?: string | null;
  description?: string | null;
  featured: boolean;
}

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showBefore, setShowBefore] = useState(false);

  const categories = [
    { label: "All Works", value: "ALL" },
    { label: "Editorial", value: "EDITORIAL" },
    { label: "French Color", value: "COLOR" },
    { label: "Matrimonial Bridal", value: "BRIDAL" },
    { label: "Transformations", value: "TRANSFORMATION" },
    { label: "Cellular Facial", value: "FACIAL" },
    { label: "The Penthouse", value: "SALON" },
  ];

  const filtered = activeCategory === "ALL"
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div className="py-16">
      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.value
                ? "bg-[#C8A46A] text-[#111111] font-semibold shadow-lg shadow-[#C8A46A]/20"
                : "bg-[#1B1B1B] text-[#929292] hover:text-[#F8F6F2] border border-white/5"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Masonry / Responsive Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              onClick={() => {
                setSelectedItem(item);
                setShowBefore(false);
              }}
              className={`group relative overflow-hidden bg-[#161616] border border-white/5 cursor-pointer ${
                idx % 4 === 0 ? "sm:col-span-2 sm:h-[460px]" : "h-[380px]"
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] text-[#C8A46A] tracking-[0.25em] uppercase mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif text-xl text-[#F8F6F2] font-normal mb-2">
                  {item.title}
                </h3>
                {item.beforeImage && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-[#E8DDCE] mb-2">
                    <Layers className="w-3.5 h-3.5 text-[#C8A46A]" />
                    <span>Includes Before & After Metamorphosis</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-1 text-xs text-[#C8A46A] uppercase tracking-wider font-medium">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Enlarge Preview</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative max-w-5xl w-full bg-[#141414] border border-[#C8A46A]/30 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-[#111111]/80 rounded-full text-[#929292] hover:text-white transition-colors"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Preview Container */}
              <div className="relative flex-1 min-h-[350px] md:min-h-[500px] bg-black">
                <Image
                  src={showBefore && selectedItem.beforeImage ? selectedItem.beforeImage : selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                />

                {/* Before / After toggle button if item has before image */}
                {selectedItem.beforeImage && (
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-[#111111]/90 backdrop-blur-md p-1 border border-white/10">
                    <button
                      onClick={() => setShowBefore(false)}
                      className={`px-3 py-1 text-xs uppercase tracking-wider ${
                        !showBefore ? "bg-[#C8A46A] text-black font-semibold" : "text-[#929292]"
                      }`}
                    >
                      After
                    </button>
                    <button
                      onClick={() => setShowBefore(true)}
                      className={`px-3 py-1 text-xs uppercase tracking-wider ${
                        showBefore ? "bg-[#C8A46A] text-black font-semibold" : "text-[#929292]"
                      }`}
                    >
                      Before
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-[#161616] border-t md:border-t-0 md:border-l border-white/5">
                <div>
                  <span className="text-[10px] text-[#C8A46A] tracking-[0.25em] uppercase block mb-2">
                    {selectedItem.category} Archive
                  </span>
                  <h3 className="font-serif text-2xl text-[#F8F6F2] mb-4">
                    {selectedItem.title}
                  </h3>
                  {selectedItem.description && (
                    <p className="text-xs text-[#929292] leading-relaxed mb-6">
                      {selectedItem.description}
                    </p>
                  )}
                  <div className="p-4 bg-[#111111] border border-white/5 text-xs text-[#E8DDCE]/80 leading-relaxed mb-6">
                    Captured at our Madison Avenue Atelier under natural daylight and studio strobes.
                  </div>
                </div>

                <Link
                  href="/book"
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs tracking-[0.2em] uppercase text-center hover:bg-[#D8B57B] transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Style</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
