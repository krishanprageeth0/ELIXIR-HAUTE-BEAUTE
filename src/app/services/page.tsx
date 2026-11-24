import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesCatalog from "@/components/services/ServicesCatalog";
import { prisma } from "@/lib/prisma";
import { defaultCategories, defaultServices } from "@/lib/default-data";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Haute Services & Rituals | ÉLIXIR HAUTE BEAUTÉ",
  description: "Explore our curated catalog of precision haircuts, French balayage, Japanese rebonding, head spa, and 24K gold facial aesthetics.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let categories: any[] = defaultCategories;
  let services: any[] = defaultServices;

  try {
    const [dbCategories, dbServices] = await Promise.all([
      prisma.category.findMany({
        orderBy: { orderIndex: "asc" },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      }),
    ]);
    if (dbCategories && dbCategories.length > 0) categories = dbCategories;
    if (dbServices && dbServices.length > 0) services = dbServices;
  } catch (error) {
    console.warn("Database fallback activated on ServicesPage:", error);
  }

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-36 pb-20 bg-[#161616] border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C8A46A]/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Atelier Menu</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F8F6F2] font-light uppercase tracking-wide mb-6">
            Haute Coiffure & Aesthetics
          </h1>

          <p className="text-sm sm:text-base text-[#E8DDCE]/80 font-light max-w-2xl mx-auto leading-relaxed">
            Every ritual is conducted in private penthouse chambers with bespoke formulations tailored to individual hair texture and dermatological needs.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <ServicesCatalog
          categories={categories}
          services={services}
          initialCategory={category}
        />
      </div>

      <Footer />
    </main>
  );
}
