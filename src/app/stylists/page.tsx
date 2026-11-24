import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { defaultStaff } from "@/lib/default-data";
import { Star, Calendar, ArrowRight, Sparkles, Award, Clock } from "lucide-react";
import { InstagramIcon } from "@/components/icons/BrandIcons";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Master Stylists & Artistic Directors | ÉLIXIR HAUTE BEAUTÉ",
  description: "Meet our world-renowned team of master hair sculptors, French blonding specialists, and aesthetic directors.",
};

export default async function StylistsPage() {
  let staff: any[] = defaultStaff;

  try {
    const dbStaff = await prisma.staff.findMany({
      where: { isActive: true },
      include: {
        schedules: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
      orderBy: { rating: "desc" },
    });
    if (dbStaff && dbStaff.length > 0) staff = dbStaff;
  } catch (error) {
    console.warn("Database fallback activated on StylistsPage:", error);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />

      {/* Header */}
      <section className="relative pt-36 pb-20 bg-[#161616] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Artisans</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F8F6F2] font-light uppercase tracking-wide mb-6">
            Our Master Stylists & Directors
          </h1>

          <p className="text-sm sm:text-base text-[#E8DDCE]/80 font-light max-w-2xl mx-auto leading-relaxed">
            Formed in the prestigious ateliers of Paris, Milan, and Tokyo. Each artisan brings a minimum of eight years of high-fashion and red-carpet mastery.
          </p>
        </div>
      </section>

      {/* Stylists List */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="space-y-16">
          {staff.map((member, idx) => {
            const isReversed = idx % 2 === 1;
            const workingDays = member.schedules
              ? member.schedules
                  .filter((s: any) => s.isWorking)
                  .map((s: any) => dayNames[s.dayOfWeek])
                  .join(", ")
              : "Tue, Wed, Thu, Fri, Sat, Sun";

            return (
              <div
                key={member.id}
                className={`bg-[#161616] border border-white/5 p-6 sm:p-10 flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-10 sm:gap-14 items-center`}
              >
                {/* Photo */}
                <div className="relative w-full lg:w-96 h-96 sm:h-[420px] shrink-0 overflow-hidden border border-[#C8A46A]/20">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#111111]/85 backdrop-blur-md border border-[#C8A46A]/30 text-xs text-[#C8A46A] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#C8A46A]" />
                    <span>{member.rating?.toFixed ? member.rating.toFixed(2) : member.rating} ({member.reviewCount || 200}+ reviews)</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#C8A46A]/10 text-[#C8A46A] border border-[#C8A46A]/30 text-[11px] tracking-widest uppercase mb-4">
                      <Award className="w-3 h-3" />
                      <span>{member.experienceYears} Years Atelier Mastery</span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F6F2] font-light mb-2">
                      {member.name}
                    </h2>

                    <p className="text-xs text-[#C8A46A] uppercase tracking-[0.2em] font-medium mb-6">
                      {member.title}
                    </p>

                    <p className="text-sm text-[#929292] leading-relaxed mb-6 font-light">
                      {member.bio}
                    </p>

                    {/* Specialization Tags */}
                    <div className="mb-6">
                      <span className="text-[10px] text-[#929292] uppercase tracking-widest block mb-2">
                        Areas of Expertise
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(member.specializations || "Precision Styling").split(",").map((spec: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-[#111111] text-[11px] text-[#E8DDCE] border border-white/10"
                          >
                            {spec.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Working Days */}
                    <div className="flex items-center gap-2 text-xs text-[#929292] mb-8">
                      <Clock className="w-4 h-4 text-[#C8A46A]" />
                      <span>Working Days: <strong className="text-[#E8DDCE] font-normal">{workingDays}</strong> (09:00 - 19:00)</span>
                    </div>
                  </div>

                  {/* Booking CTA */}
                  <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    {member.instagram && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#929292]">
                        <InstagramIcon className="w-4 h-4 text-[#C8A46A]" />
                        <span>{member.instagram}</span>
                      </span>
                    )}

                    <Link
                      href={`/book?stylist=${member.id}`}
                      className="px-8 py-3.5 bg-[#C8A46A] text-[#111111] font-semibold text-xs tracking-[0.2em] uppercase hover:bg-[#D8B57B] transition-colors flex items-center gap-2 shadow-lg shadow-[#C8A46A]/20"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book with {member.name.split(" ")[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
