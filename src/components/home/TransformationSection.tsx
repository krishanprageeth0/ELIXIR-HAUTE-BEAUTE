"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  beforeImage?: string | null;
  description?: string | null;
}

export default function TransformationSection({ items }: { items: GalleryItem[] }) {
  const [sliderPos, setSliderPos] = useState(50);
  const transformItem = items.find((i) => i.beforeImage) || items[0];

  return (
    <section className="py-28 bg-[#111111] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visible Metamorphosis</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F8F6F2] font-light tracking-[0.05em] uppercase mb-4">
            The Art of Transformation
          </h2>
          <p className="text-sm text-[#929292] leading-relaxed">
            Drag the interactive slider to reveal how our precision color alchemy and restorative Japanese treatments reinvent hair texture and luminosity.
          </p>
        </div>

        {/* Interactive Before/After Comparison Card */}
        {transformItem && transformItem.beforeImage && (
          <div className="max-w-4xl mx-auto mb-20 bg-[#161616] p-4 sm:p-6 border border-[#C8A46A]/20">
            <div className="relative h-[380px] sm:h-[480px] w-full overflow-hidden select-none">
              {/* After Image (Full background) */}
              <Image
                src={transformItem.image}
                alt="After Transformation"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-[#111111]/80 backdrop-blur-md border border-[#C8A46A]/40 text-[10px] tracking-widest uppercase text-[#C8A46A]">
                After ÉLIXIR
              </div>

              {/* Before Image (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden z-10"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <Image
                  src={transformItem.beforeImage}
                  alt="Before Transformation"
                  fill
                  className="object-cover grayscale"
                />
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-[#111111]/80 backdrop-blur-md border border-white/20 text-[10px] tracking-widest uppercase text-[#E8DDCE]">
                  Prior Texture
                </div>
              </div>

              {/* Divider Line & Handle */}
              <div
                className="absolute top-0 bottom-0 z-30 w-1 bg-[#C8A46A] cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-9 h-9 rounded-full bg-[#111111] border-2 border-[#C8A46A] flex items-center justify-center shadow-2xl -ml-[1px]">
                  <span className="text-[10px] text-[#C8A46A] font-bold">⇄</span>
                </div>
              </div>

              {/* Invisible range input for intuitive drag/touch */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
                aria-label="Before and After transformation slider"
              />
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg text-[#F8F6F2]">
                  {transformItem.title}
                </h3>
                <p className="text-xs text-[#929292] mt-0.5">
                  {transformItem.description}
                </p>
              </div>

              <Link
                href="/book"
                className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-[#C8A46A] hover:text-white transition-colors"
              >
                <span>Request This Look</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Gallery Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group relative h-72 sm:h-80 overflow-hidden bg-[#1B1B1B] border border-white/5"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] text-[#C8A46A] tracking-[0.2em] uppercase mb-1">
                  {item.category}
                </span>
                <h4 className="font-serif text-base text-[#F8F6F2] font-normal leading-snug">
                  {item.title}
                </h4>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#E8DDCE]">
                  <Eye className="w-3.5 h-3.5 text-[#C8A46A]" />
                  <span>View in Gallery</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#C8A46A] hover:text-white transition-colors"
          >
            <span>Explore The Complete Visual Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
