"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, ArrowRight, Sparkles, Plus, Check } from "lucide-react";

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
  isFeatured: boolean;
  category: { id: string; name: string; slug: string };
}

export default function ServicesCatalog({
  categories,
  services,
  initialCategory,
}: {
  categories: Category[];
  services: Service[];
  initialCategory?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "duration">("featured");

  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        const matchesCategory =
          selectedCategory === "all" || s.category.slug === selectedCategory;
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "duration") return a.durationMinutes - b.durationMinutes;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="py-16 sm:py-24">
      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-8 border-b border-white/10">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#929292]" />
          <input
            type="text"
            placeholder="Search treatments, balayage, facial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181818] border border-white/10 text-xs text-[#F8F6F2] placeholder-[#929292] pl-11 pr-4 py-3 focus:outline-none focus:border-[#C8A46A] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#929292] hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#929292] uppercase tracking-wider whitespace-nowrap">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#181818] border border-white/10 text-xs text-[#E8DDCE] px-4 py-3 focus:outline-none focus:border-[#C8A46A] cursor-pointer"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration">Duration: Short to Long</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-12">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all ${
            selectedCategory === "all"
              ? "bg-[#C8A46A] text-[#111111] font-semibold"
              : "bg-[#1B1B1B] text-[#929292] hover:text-[#F8F6F2] border border-white/5"
          }`}
        >
          All Categories ({services.length})
        </button>
        {categories.map((cat) => {
          const count = services.filter((s) => s.category.slug === cat.slug).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? "bg-[#C8A46A] text-[#111111] font-semibold"
                  : "bg-[#1B1B1B] text-[#929292] hover:text-[#F8F6F2] border border-white/5"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="text-xs text-[#929292] tracking-wider uppercase mb-8">
        Showing {filteredServices.length} {filteredServices.length === 1 ? "Treatment" : "Treatments"}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="py-20 text-center bg-[#161616] border border-white/5 p-8">
          <Sparkles className="w-8 h-8 text-[#C8A46A] mx-auto mb-4" />
          <h3 className="font-serif text-xl text-[#F8F6F2] mb-2">No Treatments Found</h3>
          <p className="text-xs text-[#929292] max-w-sm mx-auto mb-6">
            We couldn&apos;t find any ritual matching your search criteria. Please adjust your filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="px-6 py-2.5 bg-[#C8A46A] text-[#111111] text-xs uppercase tracking-widest font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group bg-[#161616] border border-white/5 hover:border-[#C8A46A]/40 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#111111]/80 backdrop-blur-md border border-white/10 text-[11px] text-[#E8DDCE] flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#C8A46A]" />
                    <span>{service.durationMinutes} min</span>
                  </div>

                  <div className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 bg-[#C8A46A]/20 text-[#C8A46A] border border-[#C8A46A]/30">
                    {service.category.name}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-[#F8F6F2] font-light mb-2.5 group-hover:text-[#C8A46A] transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#929292] leading-relaxed line-clamp-3 mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] tracking-widest text-[#929292] uppercase block">
                        Investment
                      </span>
                      <span className="font-serif text-2xl text-[#C8A46A] font-light">
                        ${service.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/services/${service.slug}`}
                        className="px-3.5 py-2 text-xs text-[#929292] hover:text-white transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/book?service=${service.id}`}
                        className="px-4 py-2 bg-[#C8A46A] text-[#111111] font-semibold text-[11px] tracking-wider uppercase hover:bg-[#D8B57B] transition-colors flex items-center gap-1.5 shadow-md shadow-[#C8A46A]/10"
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
      )}
    </div>
  );
}
