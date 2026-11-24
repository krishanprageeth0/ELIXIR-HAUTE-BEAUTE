import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryClient from "@/components/gallery/GalleryClient";
import { prisma } from "@/lib/prisma";
import { defaultGalleryItems } from "@/lib/default-data";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Visual Archive & Haute Transformations | ÉLIXIR HAUTE BEAUTÉ",
  description: "Explore our haute couture hair portfolio, French balayage transformations, red-carpet editorial looks, and penthouse salon interior.",
};

export default async function GalleryPage() {
  let items: any[] = defaultGalleryItems;

  try {
    const dbItems = await prisma.galleryItem.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    if (dbItems && dbItems.length > 0) items = dbItems;
  } catch (error) {
    console.warn("Database fallback activated on GalleryPage:", error);
  }

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      {/* Header */}
      <section className="relative pt-36 pb-20 bg-[#161616] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Visual Archive</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F8F6F2] font-light uppercase tracking-wide mb-6">
            Haute Couture Portfolio
          </h1>

          <p className="text-sm sm:text-base text-[#E8DDCE]/80 font-light max-w-2xl mx-auto leading-relaxed">
            A testament to artistry, geometry, and light. Browse our documented client transformations and editorial runway collections.
          </p>
        </div>
      </section>

      {/* Interactive Gallery */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <GalleryClient items={items} />
      </div>

      <Footer />
    </main>
  );
}
