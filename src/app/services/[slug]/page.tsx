import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Clock, DollarSign, Calendar, CheckCircle2, ArrowRight, Star, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await prisma.service.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });

  if (!service) return { title: "Service | ÉLIXIR HAUTE BEAUTÉ" };

  return {
    title: `${service.name} | ÉLIXIR HAUTE BEAUTÉ`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const service = await prisma.service.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: {
      category: true,
    },
  });

  if (!service) {
    notFound();
  }

  // Find matching stylists who specialize in this service type
  const staff = await prisma.staff.findMany({
    where: { isActive: true },
    take: 3,
    orderBy: { rating: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 bg-[#161616] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Details */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{service.category.name}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F8F6F2] font-light uppercase leading-tight mb-6">
                {service.name}
              </h1>

              <p className="text-sm sm:text-base text-[#E8DDCE]/80 font-light leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Price & Duration Stat Row */}
              <div className="flex flex-wrap items-center gap-8 py-6 border-y border-white/10 mb-8">
                <div>
                  <span className="text-[10px] tracking-widest text-[#929292] uppercase block">
                    Atelier Investment
                  </span>
                  <span className="font-serif text-3xl text-[#C8A46A] font-light">
                    ${service.price}
                  </span>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div>
                  <span className="text-[10px] tracking-widest text-[#929292] uppercase block">
                    Dedicated Duration
                  </span>
                  <div className="flex items-center gap-1.5 text-base text-[#F8F6F2] font-medium mt-0.5">
                    <Clock className="w-4 h-4 text-[#C8A46A]" />
                    <span>{service.durationMinutes} Minutes</span>
                  </div>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div>
                  <span className="text-[10px] tracking-widest text-[#929292] uppercase block">
                    Experience Level
                  </span>
                  <span className="text-xs text-[#E8DDCE] uppercase tracking-wider block mt-1">
                    Master Artisan Suite
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href={`/book?service=${service.id}`}
                  className="w-full sm:w-auto px-8 py-4 bg-[#C8A46A] text-[#111111] font-semibold text-xs tracking-[0.25em] uppercase hover:bg-[#D8B57B] transition-all duration-300 shadow-xl shadow-[#C8A46A]/20 flex items-center justify-center gap-2.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve This Experience</span>
                </Link>

                <Link
                  href="/services"
                  className="w-full sm:w-auto px-6 py-4 border border-white/10 text-xs tracking-[0.2em] uppercase text-[#929292] hover:text-white hover:border-white/30 transition-colors text-center"
                >
                  Back to Services
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative h-[420px] sm:h-[480px] w-full overflow-hidden border border-[#C8A46A]/30">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Breakdown */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-xs text-[#C8A46A] tracking-[0.3em] uppercase block mb-3">
            The ÉLIXIR Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] font-light uppercase">
            The 4-Stage Protocol
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-[#161616] p-7 border border-white/5 relative">
            <span className="font-serif text-4xl text-[#C8A46A]/30 block mb-4">01</span>
            <h3 className="font-serif text-lg text-[#F8F6F2] mb-2">Micro-Diagnostic</h3>
            <p className="text-xs text-[#929292] leading-relaxed">
              In-depth assessment of your hair shaft porosity, natural movement, and scalp health under calibrated lighting.
            </p>
          </div>

          <div className="bg-[#161616] p-7 border border-white/5 relative">
            <span className="font-serif text-4xl text-[#C8A46A]/30 block mb-4">02</span>
            <h3 className="font-serif text-lg text-[#F8F6F2] mb-2">Botanical Cleanse</h3>
            <p className="text-xs text-[#929292] leading-relaxed">
              Japanese water filtration paired with organic peptide scalp oxygenation to purify and open hair cuticles.
            </p>
          </div>

          <div className="bg-[#161616] p-7 border border-white/5 relative">
            <span className="font-serif text-4xl text-[#C8A46A]/30 block mb-4">03</span>
            <h3 className="font-serif text-lg text-[#F8F6F2] mb-2">Master Execution</h3>
            <p className="text-xs text-[#929292] leading-relaxed">
              Architectural sculpting and personalized Parisian color formulation performed by senior artistic directors.
            </p>
          </div>

          <div className="bg-[#161616] p-7 border border-white/5 relative">
            <span className="font-serif text-4xl text-[#C8A46A]/30 block mb-4">04</span>
            <h3 className="font-serif text-lg text-[#F8F6F2] mb-2">Couture Finish</h3>
            <p className="text-xs text-[#929292] leading-relaxed">
              Infusion of black caviar lipid glaze, signature French blowout, and a tailored take-home maintenance prescription.
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Specialists */}
      <section className="py-20 bg-[#161616] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs text-[#C8A46A] tracking-[0.3em] uppercase block mb-2">
                Atelier Artisans
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2] uppercase font-light">
                Recommended Stylists for This Ritual
              </h2>
            </div>
            <Link
              href="/stylists"
              className="text-xs text-[#C8A46A] uppercase tracking-wider hover:underline"
            >
              View All Stylists →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {staff.map((st) => (
              <div
                key={st.id}
                className="bg-[#111111] p-6 border border-white/5 flex items-center gap-5 hover:border-[#C8A46A]/40 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#C8A46A]/40">
                  <Image
                    src={st.photo}
                    alt={st.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-base text-[#F8F6F2]">{st.name}</h4>
                  <p className="text-[11px] text-[#C8A46A] uppercase tracking-wider mb-2">
                    {st.title}
                  </p>
                  <Link
                    href={`/book?service=${service.id}&stylist=${st.id}`}
                    className="inline-flex items-center gap-1 text-[11px] text-[#E8DDCE] hover:text-[#C8A46A] uppercase tracking-wider font-semibold"
                  >
                    <span>Select for Booking</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
